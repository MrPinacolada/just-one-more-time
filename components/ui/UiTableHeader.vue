<template>
  <th 
    :class="headerClasses"
    @click="handleSort"
  >
    {{ label }}
    <UiSortIcon 
      v-if="sortable"
      :active="isActive" 
      :order="sortOrder" 
    />
  </th>
</template>

<script setup lang="ts">
import { UserFields, SortOrder } from '~/types/enums'

interface Props {
  field: UserFields
  label: string
  sortable?: boolean
  currentSortBy?: UserFields | null
  currentSortOrder?: SortOrder
}

const props = withDefaults(defineProps<Props>(), {
  sortable: true
})

const emit = defineEmits<{
  sort: [field: UserFields, order: SortOrder]
}>()

const headerClasses = computed(() => {
  const base = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
  const clickable = props.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
  return [base, clickable].join(' ')
})

const isActive = computed(() => props.currentSortBy === props.field)

const sortOrder = computed(() => props.currentSortOrder || SortOrder.ASC)

const handleSort = () => {
  if (!props.sortable) return
  
  const newOrder = isActive.value && props.currentSortOrder === SortOrder.ASC 
    ? SortOrder.DESC 
    : SortOrder.ASC
    
  emit('sort', props.field, newOrder)
}
</script>