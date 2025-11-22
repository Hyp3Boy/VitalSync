import api from '@/lib/api';
import { RegisterFormValues } from '@/lib/validations/auth';

export const registerUser = async (userData: RegisterFormValues) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    // Manejo de errores más específico si la API devuelve mensajes
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error en el registro');
    }
    throw new Error('Un error inesperado ocurrió');
  }
};
