<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ButtonVariant } from '~/types/enums'

interface Props {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: ButtonVariant.PRIMARY,
  size: 'md',
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2'
  
  const variants = {
    [ButtonVariant.PRIMARY]: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    [ButtonVariant.SECONDARY]: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    [ButtonVariant.DANGER]: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    [ButtonVariant.SUCCESS]: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return [base, variants[props.variant], sizes[props.size], disabled].join(' ')
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>