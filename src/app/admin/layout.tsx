import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import { AdminShell } from '@/components/layouts/admin-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  if (session.user.role !== 'admin') {
    if (session.user.role === 'donor') {
      redirect('/dashboard');
    } else if (session.user.role === 'center') {
      redirect('/hospital/dashboard');
    }
    redirect('/');
  }

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
