import useAuthentication from 'hooks/useAuthentication';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

interface CreateResourceForm {
  name: string;
  description: string;
  url: string;
}

export default function AdminDashboard() {
  const [auth, loading] = useAuthentication();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateResourceForm>();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auth) {
    router.push('/admin/login');
    return <div></div>;
  }

  return (
    <div>
      <div>FindString()()</div>
    </div>
  );
}
