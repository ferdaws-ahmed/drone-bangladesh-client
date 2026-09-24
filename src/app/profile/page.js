import { redirect } from 'next/navigation';

// Legacy /profile URL — seamlessly redirect to dashboard profile
export default function LegacyProfilePage() {
  redirect('/dashboard/profile');
}
