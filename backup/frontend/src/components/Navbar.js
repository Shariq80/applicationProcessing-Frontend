import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-black">
            PROSAPIENS
          </Link>
          {isAuthenticated && (
            <div className="space-x-4">
              <Link href="/active-jobs" className={`text-black hover:text-blue-800 ${router.pathname === '/active-jobs' ? 'font-bold' : ''}`}>
                Active Jobs
              </Link>
              <Link href="/jobs" className={`text-black hover:text-blue-800 ${router.pathname === '/jobs' ? 'font-bold' : ''}`}>
                Manage Jobs
              </Link>
              <button onClick={logout} className="btn btn-primary">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
