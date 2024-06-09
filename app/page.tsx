import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  const session = getServerSession(authOptions)

  if (!session.user) {
    signIn()
  }
  
  return (
    <div>
      Page
      <Link href="/mails">Check mails</Link>
    </div>
  )
}

export default Page
