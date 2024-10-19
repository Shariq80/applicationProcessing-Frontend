import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/active-jobs');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to PROSAPIENS AI RESUME MATCHER</h1>
          <button 
            onClick={login} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login with Google
          </button>
        </div>
      </Layout>
    );
  }

  // This return statement is just a placeholder, as authenticated users will be redirected
  return (
    <Layout>
      <div className="text-center">
        <p>Redirecting to active jobs...</p>
      </div>
    </Layout>
  );
}
