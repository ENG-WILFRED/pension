import AuthForm from '@/app/components/AuthForm';

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return <AuthForm isLogin={true} />;
}
