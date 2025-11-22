import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Backend devuelve un token y datos de usuario en /api/auth/login
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrDni: { label: 'Email or DNI', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Llama a tu backend para verificar las credenciales
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              body: JSON.stringify({
                emailOrDni: credentials?.emailOrDni,
                password: credentials?.password,
              }),
              headers: { 'Content-Type': 'application/json' },
            }
          );
          const user = await res.json();

          if (res.ok && user) {
            // Devuelve el objeto de usuario que NextAuth usará para crear la sesión
            return user; // Ej: { id, name, email, token }
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // Redirige a tu página de login si el usuario no está autenticado
  },
  // ... callbacks para JWT y session, si necesitas guardar el token
});

export { handler as GET, handler as POST };
