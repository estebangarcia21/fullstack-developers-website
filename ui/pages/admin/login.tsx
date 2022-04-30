import useAuthentication from 'hooks/useAuthentication';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import styles from 'styles/pages/Admin.module.scss';
import { AXIOS_CLIENT } from 'utils/queryClient';

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const [isAuthenticated, loading] = useAuthentication();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const loginMutation = useMutation((formData: LoginForm) => {
    return AXIOS_CLIENT.post('/login', formData, { withCredentials: true });
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: ({ data }) => {
        if (data.data.success) {
          router.reload();
        }
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    router.push('/admin/dashboard');
  }

  return (
    <div className={styles.loginPanel}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input {...register('email')} />
        {errors.email && <span>This field is required</span>}

        <label htmlFor="password">Password</label>
        <input {...register('password')} />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
