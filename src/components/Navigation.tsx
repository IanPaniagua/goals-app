'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link
              href="/dashboard"
              className={`${
                isActive('/dashboard')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium`}
            >
              Dashboard
            </Link>
            <Link
              href="/goals"
              className={`${
                isActive('/goals')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium`}
            >
              Objetivos
            </Link>
            <Link
              href="/personal"
              className={`${
                isActive('/personal')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium`}
            >
              Personal
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
} 