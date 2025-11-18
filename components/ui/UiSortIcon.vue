<template>
  <span class="inline-block ml-1">
    <svg 
      v-if="!active" 
      class="w-3 h-3 text-gray-400" 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M5 10l5-5 5 5H5z"/>
      <path d="M5 10l5 5 5-5H5z" opacity="0.3"/>
    </svg>
    <svg 
      v-else-if="order === 'asc'" 
      class="w-3 h-3 text-gray-600" 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M5 10l5-5 5 5H5z"/>
    </svg>
    <svg 
      v-else 
      class="w-3 h-3 text-gray-600" 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M15 10l-5 5-5-5h10z"/>
    </svg>
  </span>
</template>

<script setup lang="ts">
import type { SortOrder } from '~/types/enums';

interface Props {
  active?: boolean
  order?: SortOrder
}

defineProps<Props>()
</script>