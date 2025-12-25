import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import { DonorShell } from '../../components/donor/donor-shell';

export default async function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  if (session.user.role !== 'donor') {
    if (session.user.role === 'admin') {
      redirect('/admin');
    } else if (session.user.role === 'staff') {
      redirect('/hospital/dashboard');
    }
  }

  return (
    <DonorShell>
      {children}
    </DonorShell>
  );
}
