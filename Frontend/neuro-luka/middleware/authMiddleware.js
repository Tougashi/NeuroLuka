import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import { useEffect } from 'react';

export const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          await axios.get('/api/user');
        } catch (error) {
          router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
        }
      };
      
      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};
