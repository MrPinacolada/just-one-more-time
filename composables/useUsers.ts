import { useUserStore } from '~/stores/user'

export const useUsers = () => {
  const store = useUserStore()
  
  return {
    users: computed(() => store.allUsers),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    initialized: computed(() => store.initialized),
    
    pagination: computed(() => ({
      page: store.currentPage,
      limit: store.itemsPerPage,
      total: store.totalItems,
      totalPages: store.totalPages,
      hasNext: store.hasNextPage,
      hasPrev: store.hasPrevPage
    })),
    
    totalPages: computed(() => store.totalPages),
    hasNextPage: computed(() => store.hasNextPage),
    hasPrevPage: computed(() => store.hasPrevPage),
    
    loadUsers: store.loadUsers,
    fetchUsers: store.getUsers,
    getUserById: store.getUserById,
    createUser: store.createUser,
    updateUser: store.updateUser,
    deleteUser: store.deleteUser,
    nextPage: store.nextPage,
    prevPage: store.prevPage,
    goToPage: store.goToPage,
    clearError: store.clearError,
    resetPagination: store.resetPagination
  }
}