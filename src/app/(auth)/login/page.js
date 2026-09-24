import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 p-4">
      <LoginForm />
    </main>
  );
}