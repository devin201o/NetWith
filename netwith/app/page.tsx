'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser()
      if (user) {
        // User is logged in, redirect to discover
        router.push('/discover')
      } else {
        // Not logged in, show landing page
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #f8f9ff, #feffff)'
      }}
    >
      <div className="text-center space-y-6 p-8">
        <h1 
          className="text-5xl font-bold"
          style={{ color: '#252456' }}
        >
          NetWith
        </h1>
        <p className="text-xl text-gray-600 max-w-md">
          Network based on what you're building, not where you work.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            onClick={() => router.push('/signup')}
            size="lg"
            className="text-white hover:opacity-90"
            style={{ backgroundColor: '#252456' }}
          >
            Get Started
          </Button>
          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            size="lg"
            className="hover:bg-gray-50"
            style={{ 
              borderColor: '#fd9e25',
              color: '#252456'
            }}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  )
}