export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum UserFields {
  ID = 'id',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  LAST_VISITED_AT = 'lastVisitedAt'
}

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger',
  SUCCESS = 'success'
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export const UI_CONSTANTS = {
  SEARCH_DEBOUNCE_DELAY: 300,
  DEFAULT_PAGE_SIZE: 10,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100
} as const

export const USER_MESSAGES = {
  LOADING: 'Загрузка...',
  NO_USERS_FOUND: 'Пользователи не найдены',
  CONFIRM_DELETE: 'Вы уверены, что хотите удалить пользователя',
  ERROR_LOADING_USERS: 'Не удалось загрузить список пользователей',
  ERROR_DELETING_USER: 'Не удалось удалить пользователя',
  RETRY: 'Повторить',
  CLEAR_FILTERS: 'Очистить',
  ADD_USER: 'Добавить пользователя',
  EDIT_USER: 'Редактировать пользователя',
  EDIT: 'Редактировать',
  DELETE: 'Удалить',
  SAVE: 'Сохранить',
  CREATE: 'Создать',
  CANCEL: 'Отмена',
  FORM_LABELS: {
    FIRST_NAME: 'Имя',
    LAST_NAME: 'Фамилия',
    EMAIL: 'Email'
  },
  FORM_PLACEHOLDERS: {
    FIRST_NAME: 'Введите имя',
    LAST_NAME: 'Введите фамилию',
    EMAIL: 'Введите email'
  },
  VALIDATION: {
    REQUIRED_FIRST_NAME: 'Имя обязательно для заполнения',
    REQUIRED_LAST_NAME: 'Фамилия обязательна для заполнения',
    REQUIRED_EMAIL: 'Email обязателен для заполнения',
    MIN_LENGTH_FIRST_NAME: 'Имя должно содержать минимум 2 символа',
    MIN_LENGTH_LAST_NAME: 'Фамилия должна содержать минимум 2 символа',
    INVALID_EMAIL: 'Некорректный формат email'
  },
  SEARCH_PLACEHOLDER: {
    GLOBAL: 'Поиск по имени или email...',
    ID: 'Поиск по ID...',
    FIRST_NAME: 'Поиск по имени...',
    LAST_NAME: 'Поиск по фамилии...',
    EMAIL: 'Поиск по email...',
    LAST_VISITED: 'Поиск по дате...'
  }
} as const

export const TABLE_CONFIG = {
  COLUMNS: [
    {
      key: UserFields.ID,
      label: 'ID',
      sortable: true,
      searchable: true
    },
    {
      key: UserFields.FIRST_NAME,
      label: 'Имя',
      sortable: true,
      searchable: true
    },
    {
      key: UserFields.LAST_NAME,
      label: 'Фамилия',
      sortable: true,
      searchable: true
    },
    {
      key: UserFields.EMAIL,
      label: 'Email',
      sortable: true,
      searchable: true
    },
    {
      key: UserFields.LAST_VISITED_AT,
      label: 'Последний визит',
      sortable: true,
      searchable: true
    }
  ]
} as const