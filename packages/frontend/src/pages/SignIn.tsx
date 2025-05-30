import { SignInForm } from '@/components/SignInForm';
import { useAuth } from '@/hooks/useAuth';
import type { SignInFormValues } from '@/types/forms/signInForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function SignIn() {
  const { session, onSignIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const onSubmit = async (data: SignInFormValues) => {
    const toastId = toast.loading('Entrando...');

    try {
      const response = await fetch('http://localhost:8080/user/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        const user = JSON.parse(atob(responseData.token.split('.')[1]));
        onSignIn({
          user,
          token: responseData.token,
        });
        toast.success(`Olá, ${user.username}. Você entrou!`, { id: toastId });
      } else {
        let errorMessage;

        if (response.status === 401) {
          errorMessage = 'Email ou senha incorretos';
        } else {
          errorMessage = 'Não foi possível entrar';
        }

        toast.error(errorMessage, { id: toastId });
      }
    } catch {
      toast.error('Erro de conexão. Verifique sua internet', { id: toastId });
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
