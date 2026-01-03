import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import { HospitalShell } from '@/components/layouts/hospital-shell';

export default async function HospitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  if (session.user.role !== 'center') {
    if (session.user.role === 'donor') {
      redirect('/dashboard');
    } else if (session.user.role === 'admin') {
      redirect('/admin');
    }
    redirect('/');
  }

  return (
    <HospitalShell>
      {children}
    </HospitalShell>
  );
}
