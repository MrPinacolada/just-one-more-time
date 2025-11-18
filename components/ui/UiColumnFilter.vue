<template>
  <td class="px-6 py-2">
    <UiInput
      v-model="filterValue"
      :placeholder="placeholder"
      size="sm"
      @input="handleInput"
    />
  </td>
</template>

<script setup lang="ts">
import { UI_CONSTANTS } from '~/types/enums'

interface Props {
  modelValue: string
  placeholder: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  filter: []
}>()

const filterValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

let filterTimeout: ReturnType<typeof setTimeout> | null = null

const handleInput = () => {
  if (filterTimeout) {
    clearTimeout(filterTimeout)
  }
  
  filterTimeout = setTimeout(() => {
    emit('filter')
  }, UI_CONSTANTS.SEARCH_DEBOUNCE_DELAY)
}
</script>