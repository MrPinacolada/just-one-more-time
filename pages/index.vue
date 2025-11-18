<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto py-8 px-4">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Управление пользователями
        </h1>
      </header>

      <div class="bg-white rounded-lg shadow">
        <UserTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserTable from '~/components/UserTable.vue'
</script>