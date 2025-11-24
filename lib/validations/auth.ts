// Validaciones para autenticación
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  nombres: string
  apellidos: string
  email: string
  telefono?: string
  password: string
  confirmPassword: string
}

export function validateLoginData(data: any): { isValid: boolean; error?: string; validData?: LoginData } {
  const { email, password } = data

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return { isValid: false, error: 'Email es requerido' }
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return { isValid: false, error: 'Contraseña es requerida' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' }
  }

  return {
    isValid: true,
    validData: { email: email.trim(), password }
  }
}

export function validateRegisterData(data: any): { isValid: boolean; error?: string; validData?: RegisterData } {
  const { nombres, apellidos, email, telefono, password, confirmPassword } = data

  if (!nombres || typeof nombres !== 'string' || nombres.trim() === '') {
    return { isValid: false, error: 'Nombres son requeridos' }
  }

  if (!apellidos || typeof apellidos !== 'string' || apellidos.trim() === '') {
    return { isValid: false, error: 'Apellidos son requeridos' }
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return { isValid: false, error: 'Email es requerido' }
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return { isValid: false, error: 'Contraseña debe tener al menos 6 caracteres' }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Las contraseñas no coinciden' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' }
  }

  if (telefono && (typeof telefono !== 'string' || telefono.trim() === '')) {
    return { isValid: false, error: 'Formato de teléfono inválido' }
  }

  return {
    isValid: true,
    validData: {
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      email: email.trim(),
      telefono: telefono?.trim() || '',
      password,
      confirmPassword
    }
  }
}