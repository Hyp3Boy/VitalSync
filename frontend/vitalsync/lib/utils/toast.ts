import { toast } from 'sonner'

export const notifySuccess = (message: string) => toast.success(message)
export const notifyError = (error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message : fallback
  toast.error(message)
}