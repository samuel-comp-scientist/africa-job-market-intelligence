'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const userType = parsedUser.userType;

    // Redirect to appropriate dashboard based on user type
    const dashboardRoutes = {
      jobseeker: '/dashboard/jobseeker',
      recruiter: '/dashboard/recruiter',
      researcher: '/dashboard/researcher',
      developer: '/dashboard/developer',
      admin: '/dashboard/admin'
    };

    const targetRoute = dashboardRoutes[userType] || '/dashboard/jobseeker';
    router.push(targetRoute);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
