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
import { SignUpFormSchema, type SignUpFormValues } from '@/types/signUpForm';

type SignUpFormProps = {
  onSubmit: SubmitHandler<SignUpFormValues>;
};

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const onInvalid: SubmitErrorHandler<SignUpFormValues> = (data) => {
    const errorMessages = [];

    if (data.username?.message) {
      errorMessages.push(`Nome de usuário: ${data.username.message}`);
    }

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
          <CardTitle>Crie uma conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar a sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="exemplo"
                  aria-invalid={Boolean(errors.username)}
                  required
                  {...register('username', { required: true })}
                />
                {errors.username && (
                  <p className="text-xs text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>
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
                  Criar conta
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Já possui uma conta?{' '}
              <Link to={'/sign-in'} className="underline underline-offset-4">
                Entrar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
