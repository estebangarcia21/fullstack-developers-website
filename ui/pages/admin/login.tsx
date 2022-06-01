import useAuthentication from 'hooks/useAuthentication';
import { GetServerSideProps } from 'next';
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
    return AXIOS_CLIENT.post('login', formData, { withCredentials: true });
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/dashboard');
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftHalfStripe} />
      <div className={styles.rightHalfStripe} />

      <div className={styles.loginContainer}>
        <div>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h1 className={styles.title}>Login</h1>

            <div>
              <label htmlFor="email">Email</label>
              <input type="email" {...register('email')} />
              {errors.email && <span>This field is required</span>}
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" {...register('password')} />
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  return { props: {} };
};
