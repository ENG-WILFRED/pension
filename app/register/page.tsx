import AuthForm from '@/app/components/AuthForm';

export const metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return <AuthForm isLogin={false} />;
}
