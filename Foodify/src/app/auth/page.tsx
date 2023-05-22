'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react'

const Auth = () => {
    const router = useRouter();
    const { status } = useSession({
      required: true,
      onUnauthenticated() {
       signIn()
      },
    })

    if (status === 'authenticated') {
        router.push('/main');
    }
}

export default Auth