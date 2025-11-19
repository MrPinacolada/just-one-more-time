import { defineStore } from 'pinia';
import type { User, CreateUser, UpdateUser } from "~/types/user";
import { SortOrder, UserFields } from "~/types/enums";

export const useUserStore = defineStore("users", () => {
  const allUsers = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);

  const nextId = ref(51);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);

  const loadUsers = async () => {
    if (initialized.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("./userList.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const users: User[] = await response.json();
      allUsers.value = users;
      totalItems.value = users.length;
      initialized.value = true;

      if (users.length > 0) {
        nextId.value = Math.max(...users.map((u) => u.id)) + 1;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to load users";
      console.error("Error loading users:", err);
    } finally {
      loading.value = false;
    }
  };

  const getUsers = async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: UserFields;
      sortOrder?: SortOrder;
    } = {}
  ) => {
    if (!initialized.value) {
      await loadUsers();
    }

    loading.value = true;
    error.value = null;

    try {
      let filteredUsers = [...allUsers.value];

      if (params.search?.trim()) {
        const searchLower = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
      }

      if (params.sortBy) {
        filteredUsers.sort((a, b) => {
          let aValue: any = a[params.sortBy as keyof User];
          let bValue: any = b[params.sortBy as keyof User];

          if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          let comparison = 0;
          if (aValue < bValue) comparison = -1;
          if (aValue > bValue) comparison = 1;

          return params.sortOrder === SortOrder.DESC ? -comparison : comparison;
        });
      }

      const page = Math.max(1, params.page || 1);
      const limit = Math.min(100, Math.max(1, params.limit || 10));

      currentPage.value = page;
      itemsPerPage.value = limit;
      totalItems.value = filteredUsers.length;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / limit),
          hasNext: page < Math.ceil(filteredUsers.length / limit),
          hasPrev: page > 1,
        },
      };
    } catch (err: any) {
      error.value = err.message || "Failed to get users";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserById = (id: number): User | undefined => {
    return allUsers.value.find((user) => user.id === id);
  };

  const createUser = async (userData: CreateUser): Promise<User> => {
    loading.value = true;
    error.value = null;

    try {
      const emailExists = allUsers.value.some(
        (user) => user.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (emailExists) {
        throw new Error("User with this email already exists");
      }

      const newUser: User = {
        id: nextId.value++,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        lastVisitedAt: userData.lastVisitedAt || Date.now(),
      };

      allUsers.value.unshift(newUser);
      totalItems.value = allUsers.value.length;

      return newUser;
    } catch (err: any) {
      error.value = err.message || "Failed to create user";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (userData: UpdateUser): Promise<User> => {
    loading.value = true;
    error.value = null;

    try {
      const userIndex = allUsers.value.findIndex(
        (user) => user.id === userData.id
      );

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      if (userData.email) {
        const emailExists = allUsers.value.some(
          (user) =>
            user.email.toLowerCase() === userData.email!.toLowerCase() &&
            user.id !== userData.id
        );

        if (emailExists) {
          throw new Error("User with this email already exists");
        }
      }

      const existingUser = allUsers.value[userIndex]!;
      const updatedUser: User = {
        id: existingUser.id,
        firstName: userData.firstName ?? existingUser.firstName,
        lastName: userData.lastName ?? existingUser.lastName,
        email: userData.email ?? existingUser.email,
        lastVisitedAt: Date.now(),
      };

      allUsers.value[userIndex] = updatedUser;
      return updatedUser;
    } catch (err: any) {
      error.value = err.message || "Failed to update user";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const userIndex = allUsers.value.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      allUsers.value.splice(userIndex, 1);
      totalItems.value = allUsers.value.length;
    } catch (err: any) {
      error.value = err.message || "Failed to delete user";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--;
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const resetPagination = () => {
    currentPage.value = 1;
    itemsPerPage.value = 10;
  };

  return {
    allUsers: readonly(allUsers),
    loading: readonly(loading),
    error: readonly(error),
    initialized: readonly(initialized),

    currentPage: readonly(currentPage),
    itemsPerPage: readonly(itemsPerPage),
    totalItems: readonly(totalItems),
    totalPages,
    hasNextPage,
    hasPrevPage,

    loadUsers,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    nextPage,
    prevPage,
    goToPage,
    clearError,
    resetPagination,
  };
});
