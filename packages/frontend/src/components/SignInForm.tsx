import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router';
import {
  SignInFormSchema,
  type SignInFormValues,
} from '@/types/forms/signInForm';

type SignInFormProps = {
  onSubmit: SubmitHandler<SignInFormValues>;
};

export function SignInForm({ onSubmit }: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema),
  });

  const onInvalid: SubmitErrorHandler<SignInFormValues> = (data) => {
    const errorMessages = [];

    if (data.email?.message) {
      errorMessages.push(`Email: ${data.email.message}`);
    }

    if (data.password?.message) {
      errorMessages.push(`Senha: ${data.password.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Acesse sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail e senha abaixo para entrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@exemplo.com"
                  aria-invalid={Boolean(errors.email)}
                  required
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  aria-invalid={Boolean(errors.password)}
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Entrar
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
              <Link to={'/sign-up'} className="underline underline-offset-4">
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
