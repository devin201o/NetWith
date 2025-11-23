'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/discover')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Navy block with branding (on login) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between text-white relative overflow-hidden"
        style={{ backgroundColor: '#252456' }}
      >
        {/* Network Nodes Background */}
        <div className="absolute top-20 right-20 opacity-10">
          <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
            <circle cx="75" cy="75" r="50" fill="#feffff" />
            <circle cx="175" cy="175" r="37" fill="#feffff" />
            <line x1="75" y1="75" x2="175" y2="175" stroke="#feffff" strokeWidth="5" />
          </svg>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">NetWith</h1>
          <p className="text-gray-300">Connect. Collaborate. Create.</p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Find Collaborators</h3>
                <p className="text-sm text-gray-300">Connect with like-minded people</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Build Projects</h3>
                <p className="text-sm text-gray-300">Turn ideas into reality together</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Grow Network</h3>
                <p className="text-sm text-gray-300">Expand your professional circle</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-300 relative z-10">
          "The best way to predict the future is to create it together."
        </p>
      </motion.div>

      {/* Right side - Login Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-8"
        style={{ backgroundColor: '#feffff' }}
      >
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#252456' }}>Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue networking</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <Input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full text-white hover:opacity-90 transition-opacity" 
              style={{ backgroundColor: '#252456' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to NetWith?</span>
            </div>
          </div>

          <Link href="/signup">
            <Button 
              variant="outline" 
              className="w-full hover:bg-gray-50"
              style={{ borderColor: '#252456', color: '#252456' }}
            >
              Create an account
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}