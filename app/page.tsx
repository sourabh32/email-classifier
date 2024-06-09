import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';

const Page = ({ isSessionValid }) => {
  if (!isSessionValid) {
    signIn();
    return null; // Return nothing if the session is invalid
  }

  return <div>Login to view mails</div>;
};


