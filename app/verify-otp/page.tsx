import VerifyOtpClient from './VerifyOtpClient';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpClient />
    </Suspense>
  );
}
