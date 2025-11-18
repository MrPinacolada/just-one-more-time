export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface LoadingState {
  loading: boolean
  error: string | null
}

export type SortOrder = 'asc' | 'desc'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
}