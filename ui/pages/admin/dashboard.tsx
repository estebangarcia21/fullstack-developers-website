import useAuthentication from 'hooks/useAuthentication';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import styles from 'styles/pages/Admin.module.scss';
import { AXIOS_CLIENT } from 'utils/queryClient';

interface CreateResourceForm {
  name: string;
  description: string;
  url: string;
}

export default function AdminDashboard() {
  const [auth, loading] = useAuthentication();
  const router = useRouter();

  const { handleSubmit } = useForm<CreateResourceForm>();

  const logoutMutation = useMutation(() => {
    return AXIOS_CLIENT.post('logout', undefined, { withCredentials: true });
  });

  const submit = () => logoutMutation.mutate(undefined);

  if (logoutMutation.isSuccess) {
    router.push('/admin/login');
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auth) {
    router.push('/admin/login');
    return <div>NO AUTH</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      <p>
        Come back over the summer to see some teaching features for next year!
      </p>

      <form onSubmit={handleSubmit(submit)}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
