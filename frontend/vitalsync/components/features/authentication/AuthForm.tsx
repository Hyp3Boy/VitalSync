'use client'; // Marcamos como Client Component para usar hooks
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Placeholder para las funciones del servicio
const registerUser = async (data: TRegisterSchema) => {
  console.log('Registering:', data);
  await new Promise((r) => setTimeout(r, 1000));
};
const loginUser = async (data: TLoginSchema) => {
  const res = await fetch('/api/auth/mock-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return await res.json();
};

type AuthMode = 'Register' | 'Login';

export function AuthForm() {
  const [authMode, setAuthMode] = useState<AuthMode>('Register');
  const router = useRouter();

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
      toast.success('Cuenta creada correctamente');
      router.push('/');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'No se pudo registrar la cuenta');
    },
  });

  const { mutate: performLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      const { useAuthStore } = require('@/store/useAuthStore');
      const { actions } = useAuthStore.getState();
      actions.setUser(user);
      toast.success('Inicio de sesión exitoso');
      router.push('/');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'No pudimos iniciar sesión');
    },
  });

  const onRegister: SubmitHandler<TRegisterSchema> = (data) =>
    performRegister(data);
  const onLogin: SubmitHandler<TLoginSchema> = (data) => performLogin(data);

  return (
    <main className="w-full rounded-xl bg-[#fefdf7] dark:bg-background-dark/50 p-6 shadow-lg shadow-black/5 ring-1 ring-black/5 sm:p-8">
      <Tabs
        value={authMode}
        onValueChange={(value) => value && setAuthMode(value as AuthMode)}
        className="w-full"
      >
        <TabsList className="mb-4 w-full bg-[#efe6d7] text-[#5c3d2a]">
          <TabsTrigger value="Register" className="flex-1 rounded-4xl">
            Crear cuenta
          </TabsTrigger>
          <TabsTrigger value="Login" className="flex-1 rounded-4xl">
            Iniciar sesión
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Register">
          <form
            onSubmit={handleRegisterSubmit(onRegister)}
            className="flex flex-col space-y-3"
          >
            <div>
              <label
                className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
                htmlFor="dni-reg"
              >
                DNI
              </label>
              <Input
                id="dni-reg"
                className="mt-1"
                placeholder="Ingresa tu DNI"
                type="text"
                {...registerField('dni')}
              />
              {registerErrors.dni && (
                <p className="text-sm text-error">
                  {registerErrors.dni.message}
                </p>
              )}
            </div>
            {/* Repetir para otros campos: fullName, phone, email, password */}
            <div className="space-y-1">
              <label
                className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
                htmlFor="name-reg"
              >
                Nombre Completo
              </label>
              <Input
                id="name-reg"
                className="mt-1"
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
                Correo Electrónico
              </label>
              <Input
                className="mt-1"
                id="email-reg"
                type="email"
                {...registerField('email')}
              />
              {registerErrors.email && (
                <p className="text-sm text-error mt-1">
                  {registerErrors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label
                className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
                htmlFor="password-reg"
              >
                Contraseña
              </label>
              <Input
                id="password-reg"
                type="password"
                {...registerField('password')}
              />
              {registerErrors.password && (
                <p className="text-sm text-error">
                  {registerErrors.password.message}
                </p>
              )}
            </div>

            <div className="pt-3 w-full place-content-center grid">
              <Button type="submit" isLoading={isRegistering} className="px-12">
                Registrar
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="Login">
          <form
            onSubmit={handleLoginSubmit(onLogin)}
            className="flex flex-col space-y-5"
          >
            <div className="space-y-1">
              <label
                className="text-base font-medium text-brown-accent dark:text-[#f0e6c8]"
                htmlFor="email-login"
              >
                Correo Electrónico o DNI
              </label>
              <Input
                id="email-login"
                type="text"
                className="mt-1"
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
                Contraseña
              </label>
              <Input
                id="password-login"
                type="password"
                className="mt-1"
                {...loginField('password')}
              />
              {loginErrors.password && (
                <p className="text-sm text-error">
                  {loginErrors.password.message}
                </p>
              )}
            </div>
            <div className="pt-3 w-full place-content-center grid">
              <Button type="submit" isLoading={isLoggingIn} className="px-12">
                Iniciar sesión
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </main>
  );
}
