<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ USER_MESSAGES.FORM_LABELS.FIRST_NAME }}
      </label>
      <UiInput
        v-model="formData.firstName"
        :placeholder="USER_MESSAGES.FORM_PLACEHOLDERS.FIRST_NAME"
        :error="errors.firstName"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ USER_MESSAGES.FORM_LABELS.LAST_NAME }}
      </label>
      <UiInput
        v-model="formData.lastName"
        :placeholder="USER_MESSAGES.FORM_PLACEHOLDERS.LAST_NAME"
        :error="errors.lastName"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ USER_MESSAGES.FORM_LABELS.EMAIL }}
      </label>
      <UiInput
        v-model="formData.email"
        type="email"
        :placeholder="USER_MESSAGES.FORM_PLACEHOLDERS.EMAIL"
        :error="errors.email"
        required
      />
    </div>

    <div class="flex justify-end gap-2 pt-4">
          <UiButton
        type="button"
        :variant="ButtonVariant.SECONDARY"
        @click="emit('cancel')"
      >
        {{ USER_MESSAGES.CANCEL }}
      </UiButton>
      <UiButton
        type="submit"
        :variant="ButtonVariant.PRIMARY"
        :disabled="loading"
      >
        {{ loading ? USER_MESSAGES.LOADING : (isEditMode ? USER_MESSAGES.SAVE : USER_MESSAGES.CREATE) }}
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import UiInput from '~/components/ui/UiInput.vue';
import UiButton from '~/components/ui/UiButton.vue';
import type { User } from '~/types/user';
import { ButtonVariant, USER_MESSAGES } from '~/types/enums';

interface Props {
  user?: User | null;
  loading?: boolean;
}

interface Emits {
  (e: 'submit', userData: Partial<User>): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  loading: false,
});

const emit = defineEmits<Emits>();

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
});

const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
});

const isEditMode = computed(() => !!props.user);

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
  };
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
  };
};

watch(() => props.user, (newUser) => {
  resetForm();
  if (newUser) {
    formData.value = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    };
  }
}, { immediate: true });

const validateForm = (): boolean => {
  let isValid = true;
  
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
  };

  if (!formData.value.firstName.trim()) {
    errors.value.firstName = USER_MESSAGES.VALIDATION.REQUIRED_FIRST_NAME;
    isValid = false;
  } else if (formData.value.firstName.trim().length < 2) {
    errors.value.firstName = USER_MESSAGES.VALIDATION.MIN_LENGTH_FIRST_NAME;
    isValid = false;
  }

  if (!formData.value.lastName.trim()) {
    errors.value.lastName = USER_MESSAGES.VALIDATION.REQUIRED_LAST_NAME;
    isValid = false;
  } else if (formData.value.lastName.trim().length < 2) {
    errors.value.lastName = USER_MESSAGES.VALIDATION.MIN_LENGTH_LAST_NAME;
    isValid = false;
  }

  if (!formData.value.email.trim()) {
    errors.value.email = USER_MESSAGES.VALIDATION.REQUIRED_EMAIL;
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = USER_MESSAGES.VALIDATION.INVALID_EMAIL;
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  const userData: Partial<User> = {
    firstName: formData.value.firstName.trim(),
    lastName: formData.value.lastName.trim(),
    email: formData.value.email.trim(),
  };

  if (isEditMode.value && props.user) {
    userData.id = props.user.id;
  }

  emit('submit', userData);
};

// Expose функции для внешнего использования
defineExpose({
  resetForm,
  validateForm
});
</script>