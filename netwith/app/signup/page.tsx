'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

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

    // You'll need to update your signUp function to handle these additional fields
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
      // Success! Redirect to login
      router.push('/login')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h1 className="text-3xl font-bold text-center text-purple-600">Create Account</h1>
          <p className="text-center text-gray-600 mt-2">Join NetWith and network with others</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
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
              <label className="block text-sm font-medium mb-1">Bio (Optional)</label>
              <Textarea
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Profile Picture (Optional)</label>
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
            <h2 className="text-lg font-semibold text-gray-900">Skills *</h2>
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
              <Button type="button" onClick={addSkill}>Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Interests *</h2>
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
              <Button type="button" onClick={addInterest}>Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="px-3 py-1">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium mb-1">Experience *</label>
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
            <label className="block text-sm font-medium mb-1">Education *</label>
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
          
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-purple-600 hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}