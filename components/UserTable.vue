<template>
  <div>
    <div class="p-6 border-b border-gray-200">
      <div
        class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
      >
        <h2 class="text-xl font-semibold text-gray-900">
          Управление пользователями
        </h2>

        <div class="flex gap-2">
          <UiButton
            :variant="ButtonVariant.PRIMARY"
            @click="showCreateModal = true"
          >
            {{ USER_MESSAGES.ADD_USER }}
          </UiButton>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <UiTableHeader
              v-for="column in TABLE_CONFIG.COLUMNS"
              :key="column.key"
              :field="column.key"
              :label="column.label"
              :sortable="column.sortable"
              :current-sort-by="sortBy"
              :current-sort-order="sortOrder"
              @sort="handleSort"
            />
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr class="bg-gray-50 border-b-2 border-gray-200">
            <UiColumnFilter
              v-for="column in TABLE_CONFIG.COLUMNS"
              :key="`filter-${column.key}`"
              v-model="columnFilters[column.key]"
              :placeholder="getColumnPlaceholder(column.key)"
              @filter="handleColumnFilter"
            />
            <td class="px-6 py-2 text-right">
              <UiButton
                :variant="ButtonVariant.SECONDARY"
                size="sm"
                @click="clearColumnFilters"
              >
                {{ USER_MESSAGES.CLEAR_FILTERS }}
              </UiButton>
            </td>
          </tr>

          <tr v-if="loading" class="animate-pulse">
            <td
              :colspan="TABLE_CONFIG.COLUMNS.length + 1"
              class="px-6 py-12 text-center text-gray-500"
            >
              {{ USER_MESSAGES.LOADING }}
            </td>
          </tr>
          <tr v-else-if="error" class="bg-red-50">
            <td
              :colspan="TABLE_CONFIG.COLUMNS.length + 1"
              class="px-6 py-4 text-center text-red-600"
            >
              {{ error }}
              <UiButton
                :variant="ButtonVariant.SECONDARY"
                size="sm"
                @click="
                  clearError();
                  loadUsers();
                "
                class="ml-2"
              >
                {{ USER_MESSAGES.RETRY }}
              </UiButton>
            </td>
          </tr>
          <tr v-else-if="!filteredUsers.length">
            <td
              :colspan="TABLE_CONFIG.COLUMNS.length + 1"
              class="px-6 py-12 text-center text-gray-500"
            >
              {{ USER_MESSAGES.NO_USERS_FOUND }}
            </td>
          </tr>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="column in TABLE_CONFIG.COLUMNS"
              :key="`${user.id}-${column.key}`"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ getCellValue(user, column.key) }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <div class="flex justify-end gap-2">
                <UiButton
                  :variant="ButtonVariant.SECONDARY"
                  size="sm"
                  @click="editUser(user)"
                >
                  {{ USER_MESSAGES.EDIT }}
                </UiButton>
                <UiButton
                  :variant="ButtonVariant.DANGER"
                  size="sm"
                  @click="confirmDelete(user)"
                >
                  {{ USER_MESSAGES.DELETE }}
                </UiButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-700">
          Показано {{ filteredUsers.length }} из
          {{ totalFilteredCount }} пользователей на странице
          {{ pagination.page }}
          <span
            v-if="totalFilteredCount !== users.length"
            class="text-gray-500"
          >
            (отфильтровано из {{ users.length }})
          </span>
        </div>

        <div class="flex items-center gap-2">
          <UiButton
            :variant="ButtonVariant.SECONDARY"
            size="sm"
            :disabled="!canGoToPrevPage"
            @click="handlePrevPage"
          >
            Предыдущая
          </UiButton>

          <span class="px-3 py-1 text-sm text-gray-700">
            Страница {{ pagination.page }} из {{ filteredTotalPages }}
          </span>

          <UiButton
            :variant="ButtonVariant.SECONDARY"
            size="sm"
            :disabled="!canGoToNextPage"
            @click="handleNextPage"
          >
            Следующая
          </UiButton>
        </div>
      </div>
    </div>

    <UiModal
      :show="showCreateModal"
      :title="USER_MESSAGES.ADD_USER"
      @close="handleCloseCreateModal"
    >
      <UserForm
        :loading="modalLoading"
        @submit="handleCreateUser"
        @cancel="handleCloseCreateModal"
      />
    </UiModal>

    <UiModal
      :show="showEditModal"
      :title="USER_MESSAGES.EDIT_USER"
      @close="handleCloseEditModal"
    >
      <UserForm
        :user="editingUser"
        :loading="modalLoading"
        @submit="handleUpdateUser"
        @cancel="handleCloseEditModal"
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUsers } from "~/composables/useUsers";
import type { User, UpdateUser } from "~/types/user";
import {
  UserFields,
  SortOrder,
  ButtonVariant,
  USER_MESSAGES,
  TABLE_CONFIG,
} from "~/types/enums";
import { formatDate } from "~/utils/date";

const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingUser = ref<User | null>(null);
const modalLoading = ref(false);
const sortBy = ref<UserFields | null>(null);
const sortOrder = ref<SortOrder>(SortOrder.ASC);

const columnFilters = ref({
  [UserFields.ID]: "",
  [UserFields.FIRST_NAME]: "",
  [UserFields.LAST_NAME]: "",
  [UserFields.EMAIL]: "",
  [UserFields.LAST_VISITED_AT]: "",
});

const {
  users,
  pagination,
  loading,
  error,
  loadUsers,
  clearError,
  deleteUser,
  createUser,
  updateUser,
  nextPage,
  prevPage,
} = useUsers();

const matchesFilter = (value: string | number, filter: string): boolean => {
  if (!filter) return true;
  return value.toString().toLowerCase().includes(filter.toLowerCase());
};

const getUserFieldValue = (user: User, field: UserFields): string | number => {
  switch (field) {
    case UserFields.ID:
      return user.id;
    case UserFields.FIRST_NAME:
      return user.firstName;
    case UserFields.LAST_NAME:
      return user.lastName;
    case UserFields.EMAIL:
      return user.email;
    case UserFields.LAST_VISITED_AT:
      return formatDate(user.lastVisitedAt);
    default:
      return "";
  }
};

const filteredAndSortedUsers = computed(() => {
  let result = users.value.filter((user) => {
    return Object.entries(columnFilters.value).every(([field, filterValue]) => {
      if (!filterValue) return true;
      const userValue = getUserFieldValue(user, field as UserFields);
      return matchesFilter(userValue, filterValue);
    });
  });

  if (sortBy.value) {
    result.sort((a, b) => {
      const aValue = getUserFieldValue(a, sortBy.value!);
      const bValue = getUserFieldValue(b, sortBy.value!);

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortOrder.value === SortOrder.DESC ? -comparison : comparison;
    });
  }

  return result;
});

const filteredUsers = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.limit;
  const end = start + pagination.value.limit;
  return filteredAndSortedUsers.value.slice(start, end);
});

const totalFilteredCount = computed(() => filteredAndSortedUsers.value.length);

const filteredTotalPages = computed(() =>
  Math.ceil(totalFilteredCount.value / pagination.value.limit)
);

const canGoToPrevPage = computed(() => pagination.value.page > 1);
const canGoToNextPage = computed(
  () => pagination.value.page < filteredTotalPages.value
);

onMounted(async () => {
  await loadUsers();
});

const handleColumnFilter = () => {
  pagination.value.page = 1;
};

const clearColumnFilters = () => {
  columnFilters.value = {
    [UserFields.ID]: "",
    [UserFields.FIRST_NAME]: "",
    [UserFields.LAST_NAME]: "",
    [UserFields.EMAIL]: "",
    [UserFields.LAST_VISITED_AT]: "",
  };
  pagination.value.page = 1;
};

const handleSort = (field: UserFields, order: SortOrder) => {
  sortBy.value = field;
  sortOrder.value = order;
  pagination.value.page = 1;
};

const handleNextPage = () => {
  nextPage();
};

const handlePrevPage = () => {
  prevPage();
};

const editUser = (user: User) => {
  editingUser.value = user;
  showEditModal.value = true;
};

const confirmDelete = async (user: User) => {
  if (
    confirm(
      `${USER_MESSAGES.CONFIRM_DELETE} ${user.firstName} ${user.lastName}?`
    )
  ) {
    try {
      await deleteUser(user.id);
    } catch {}
  }
};

const getCellValue = (user: User, field: UserFields) => {
  switch (field) {
    case UserFields.ID:
      return user.id;
    case UserFields.FIRST_NAME:
      return user.firstName;
    case UserFields.LAST_NAME:
      return user.lastName;
    case UserFields.EMAIL:
      return user.email;
    case UserFields.LAST_VISITED_AT:
      return formatDate(user.lastVisitedAt);
    default:
      return "";
  }
};

const handleCreateUser = async (userData: Partial<User>) => {
  modalLoading.value = true;
  try {
    await createUser(userData as Omit<User, "id" | "lastVisitedAt">);
    showCreateModal.value = false;
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
  } finally {
    modalLoading.value = false;
  }
};

const handleUpdateUser = async (userData: Partial<User>) => {
  if (!userData.id) return;

  modalLoading.value = true;
  try {
    await updateUser(userData as UpdateUser);
    showEditModal.value = false;
    editingUser.value = null;
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
  } finally {
    modalLoading.value = false;
  }
};

const handleCloseCreateModal = () => {
  showCreateModal.value = false;
};

const handleCloseEditModal = () => {
  showEditModal.value = false;
  editingUser.value = null;
};

const getColumnPlaceholder = (field: UserFields) => {
  switch (field) {
    case UserFields.ID:
      return USER_MESSAGES.SEARCH_PLACEHOLDER.ID;
    case UserFields.FIRST_NAME:
      return USER_MESSAGES.SEARCH_PLACEHOLDER.FIRST_NAME;
    case UserFields.LAST_NAME:
      return USER_MESSAGES.SEARCH_PLACEHOLDER.LAST_NAME;
    case UserFields.EMAIL:
      return USER_MESSAGES.SEARCH_PLACEHOLDER.EMAIL;
    case UserFields.LAST_VISITED_AT:
      return USER_MESSAGES.SEARCH_PLACEHOLDER.LAST_VISITED;
    default:
      return "";
  }
};
</script>
