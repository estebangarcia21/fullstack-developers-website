import { useState } from 'react';
import { useQuery } from 'react-query';
import { AXIOS_CLIENT } from 'utils/queryClient';

export default function useAuthentication(): [boolean, boolean] {
  const [auth, setAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useQuery(
    'authentication',
    async () => {
      return await AXIOS_CLIENT.get('/is-authenticated', {
        withCredentials: true,
      });
    },
    {
      onSuccess: ({ data }) => {
        setAuth(data.data.auth);
      },
      onSettled: () => {
        setLoading(false);
      },
    }
  );

  return [auth, loading];
}
