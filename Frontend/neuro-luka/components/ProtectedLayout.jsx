'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

export default function ProtectedLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/api/user');
      } catch (error) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  return <>{children}</>;
}
