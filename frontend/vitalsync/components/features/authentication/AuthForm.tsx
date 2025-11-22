'use client'; // Marcamos como Client Component para usar hooks
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

// Nuestras dependencias
import {
  loginSchema,
  registerSchema,
  TLoginSchema,
  TRegisterSchema,
} from '@/lib/validations/auth';
// import { registerUser, loginUser } from '@/services/authService'; // Aún no lo creamos, pero lo importaremos
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';

// Placeholder para las funciones del servicio
const registerUser = async (data: TRegisterSchema) => {
  console.log('Registering:', data);
  await new Promise((r) => setTimeout(r, 1000));
};
const loginUser = async (data: TLoginSchema) => {
  console.log('Logging in:', data);
  await new Promise((r) => setTimeout(r, 1000));
};

type AuthMode = 'Register' | 'Login';

export function AuthForm() {
  const [authMode, setAuthMode] = useState<AuthMode>('Register');

  // --- Lógica de Formulario de Registro ---
  const {
    register: registerField,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  // --- Lógica de Formulario de Login ---
  const {
    register: loginField,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  // --- Lógica de Mutación (Conexión con Backend) usando TanStack Query ---
  const { mutate: performRegister, isPending: isRegistering } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Ej: Redirigir al dashboard, mostrar toast de éxito
      console.log('Registration successful!');
    },
    onError: (error) => {
      // Ej: Mostrar toast de error
      console.error('Registration failed:', error);
    },
  });

  const { mutate: performLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      console.log('Login successful!');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const onRegister: SubmitHandler<TRegisterSchema> = (data) =>
    performRegister(data);
  const onLogin: SubmitHandler<TLoginSchema> = (data) => performLogin(data);

  return (
    <main className="w-full rounded-xl bg-[#fefdf7] dark:bg-background-dark/50 p-6 shadow-lg shadow-black/5 ring-1 ring-black/5 sm:p-8">
      {/* Selector de modo con Headless UI para accesibilidad */}
      <ToggleGroup
        type="single"
        value={authMode}
        onValueChange={(value: AuthMode) => {
          if (value) setAuthMode(value);
        }}
        className="mb-8 w-full"
      >
        <ToggleGroupItem value="Register" className="w-full">
          Register
        </ToggleGroupItem>
        <ToggleGroupItem value="Login" className="w-full">
          Login
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Formulario de Registro */}
      <form
        onSubmit={handleRegisterSubmit(onRegister)}
        className={clsx(
          'flex-col space-y-5',
          authMode === 'Register' ? 'flex' : 'hidden'
        )}
      >
        {/* ... Campos del formulario ... */}
        <div className="space-y-1">
          <label
            className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
            htmlFor="dni-reg"
          >
            DNI
          </label>
          <Input
            id="dni-reg"
            placeholder="Enter your DNI"
            type="text"
            {...registerField('dni')}
          />
          {registerErrors.dni && (
            <p className="text-sm text-error">{registerErrors.dni.message}</p>
          )}
        </div>
        {/* Repetir para otros campos: fullName, phone, email, password */}
        <div className="space-y-1">
          <label
            className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
            htmlFor="name-reg"
          >
            Full Name
          </label>
          <Input
            id="name-reg"
            placeholder="Enter your full name"
            type="text"
            {...registerField('fullName')}
          />
          {registerErrors.fullName && (
            <p className="text-sm text-error">
              {registerErrors.fullName.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label
            className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
            htmlFor="email-reg"
          >
            Email Address
          </label>
          <Input
            id="email-reg"
            placeholder="Enter your email"
            type="email"
            {...registerField('email')}
          />
          {registerErrors.email && (
            <p className="text-sm text-error">{registerErrors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label
            className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
            htmlFor="password-reg"
          >
            Password
          </label>
          <Input
            id="password-reg"
            placeholder="Create a password"
            type="password"
            {...registerField('password')}
          />
          {registerErrors.password && (
            <p className="text-sm text-error">
              {registerErrors.password.message}
            </p>
          )}
        </div>

        <div className="pt-3">
          <Button type="submit" isLoading={isRegistering}>
            Register
          </Button>
        </div>
      </form>

      {/* Formulario de Login */}
      <form
        onSubmit={handleLoginSubmit(onLogin)}
        className={clsx(
          'flex-col space-y-5',
          authMode === 'Login' ? 'flex' : 'hidden'
        )}
      >
        <div className="space-y-1">
          <label
            className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
            htmlFor="email-login"
          >
            Email or DNI
          </label>
          <Input
            id="email-login"
            placeholder="Enter your email or DNI"
            type="text"
            {...loginField('identifier')}
          />
          {loginErrors.identifier && (
            <p className="text-sm text-error">
              {loginErrors.identifier.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label
            className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
            htmlFor="password-login"
          >
            Password
          </label>
          <Input
            id="password-login"
            placeholder="Enter your password"
            type="password"
            {...loginField('password')}
          />
          {loginErrors.password && (
            <p className="text-sm text-error">{loginErrors.password.message}</p>
          )}
        </div>
        <div className="pt-3">
          <Button type="submit" isLoading={isLoggingIn}>
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}
