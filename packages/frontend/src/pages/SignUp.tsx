import { SignUpForm } from '@/components/SignUpForm';
import { useAuth } from '@/hooks/useAuth';
import type { SignUpFormValues } from '@/types/forms/signUpForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function SignUp() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const onSubmit = async (data: SignUpFormValues) => {
    const toastId = toast.loading('Criando conta...');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASEURL}/user/sign-up`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        toast.success(`Conta criada, ${responseData.username}! Agora entre`, {
          id: toastId,
        });
        navigate('/sign-in');
      } else {
        const errorMessage =
          response.status === 409
            ? 'Este e-mail já está em uso'
            : 'Não foi possível criar sua conta';

        toast.error(errorMessage, { id: toastId });
      }
    } catch {
      toast.error('Erro de conexão. Verifique sua internet', { id: toastId });
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
