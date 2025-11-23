'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SignUpPage() {
  // Basic info
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  
  // Skills and interests
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [interestInput, setInterestInput] = useState('')
  
  // Text fields
  const [experience, setExperience] = useState('')
  const [education, setEducation] = useState('')
  
  // Profile image
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  // Add interest
  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()])
      setInterestInput('')
    }
  }

  // Remove interest
  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove))
  }

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (skills.length < 2) {
      setError('Please add at least 2 skills')
      setLoading(false)
      return
    }

    if (interests.length === 0) {
      setError('Please add at least 1 interest')
      setLoading(false)
      return
    }

    const { data, error } = await signUp(email, password, {
      name,
      bio,
      skills,
      interests,
      experience: experience ? [experience] : [],
      education: education ? [education] : [],
      profile_image: profileImage
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Sign Up Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-8 overflow-y-auto"
        style={{ backgroundColor: '#feffff' }}
      >
        <div className="w-full max-w-2xl py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#252456' }}>Create Account</h1>
            <p className="text-gray-600 mt-2">Join NetWith and start networking</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold" style={{ color: '#252456' }}>Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Name *</label>
                  <Input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Password *</label>
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Bio (Optional)</label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Profile Picture (Optional)</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {profileImagePreview && (
                  <div className="mt-2">
                    <img 
                      src={profileImagePreview} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold" style={{ color: '#252456' }}>Skills *</h2>
              <p className="text-sm text-gray-600">Add at least 2 skills</p>
              
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., React, Python, UI Design"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} variant="outline">Add</Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="px-3 py-1"
                    style={{ backgroundColor: '#252456', color: '#feffff' }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold" style={{ color: '#252456' }}>Interests *</h2>
              <p className="text-sm text-gray-600">What are you passionate about?</p>
              
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Web Development, AI, Startups"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addInterest()
                    }
                  }}
                />
                <Button type="button" onClick={addInterest} variant="outline">Add</Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="secondary" 
                    className="px-3 py-1"
                    style={{ backgroundColor: '#252456', color: '#feffff' }}
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Experience *</label>
              <Textarea
                placeholder="Describe your relevant experience, projects, or work history..."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                rows={4}
              />
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Education *</label>
              <Textarea
                placeholder="Your educational background (e.g., UBC Computer Science, Year 3)"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
                rows={3}
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <Link href="/login" className="block mt-4">
            <Button 
              variant="outline" 
              className="w-full hover:bg-gray-50"
              style={{ borderColor: '#252456', color: '#252456' }}
            >
              Sign in instead
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Right side - Navy block with branding (on signup) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between text-white relative overflow-hidden"
        style={{ backgroundColor: '#252456' }}
      >
        {/* Network Nodes Background */}
        <div className="absolute top-20 left-20 opacity-10">
          <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
            <circle cx="75" cy="75" r="50" fill="#feffff" />
            <circle cx="175" cy="175" r="37" fill="#feffff" />
            <line x1="75" y1="75" x2="175" y2="175" stroke="#feffff" strokeWidth="5" />
          </svg>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">NetWith</h1>
          <p className="text-gray-300">Your professional network, reimagined.</p>
        </div>

        <div className="space-y-8 relative z-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">Why join NetWith?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Launch Projects Faster</h3>
                  <p className="text-sm text-gray-300">Find skilled collaborators who share your vision and passion</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Build Meaningful Connections</h3>
                  <p className="text-sm text-gray-300">Network based on skills and interests, not just job titles</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Discover Opportunities</h3>
                  <p className="text-sm text-gray-300">Get matched with people working on exciting projects</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-white/30 pl-4">
            <p className="text-lg italic">
              "NetWith helped me find the perfect co-founder for my startup. The matching algorithm is incredible!"
            </p>
            <p className="text-sm text-gray-300 mt-2">— Sarah Chen, Founder</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center relative z-10">
          <div>
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-sm text-gray-300">Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold">5K+</div>
            <div className="text-sm text-gray-300">Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold">15K+</div>
            <div className="text-sm text-gray-300">Connections</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}