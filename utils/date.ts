export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('ru-RU')
}