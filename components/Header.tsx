
"use client"
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();
  
  return (
    <header className="flex justify-between items-center p-4">
   
      
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : session ? (
        
          <div className='flex w-full justify-between' >
            <div className='flex gap-4'>
    
            <img src={session.user.image} alt={session.user.name} className="w-10 h-10 rounded-full" />
            <div className="flex-col gap-2">
              <p className="font-semibold">{session.user.name}</p>
              <p className="text-sm">{session.user.email}</p>
              </div>
             </div>
    

            <button 
              onClick={() => signOut()} 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>

         </div>
        ) : (
          <button 
            onClick={() => signIn()} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        )}
    
    </header>
  );
}
