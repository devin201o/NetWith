## What is NetWith?
Network is an application made to swiftly and efficiently connect with others in a user-friendly environment. Create meaningful networks with others that share the same interests with a swipe.

**The Problem We Solve:**
Tired of feeling like you're not good enough for LinkedIn? Tired of aimlessly swiping for connections on Tinder? NetWith bridges the gap and establishes worthwhile connections. 

**The Concept:**
NetWith takes the swipe matching simplicity of Tinder and combines it with meaningful professional content. Browse through people's portfolios, projects, and skills the way you'd swipe on Tinder—then make real connections and create things together. No pretense. No gatekeeping. Just authentic networking.

**Our Mission:**
Make meaningful networks and create things with people. Create a networking experience that's less mentally taxing, more inclusive, and genuinely enjoyable. No comparison anxiety.

### Why NetWith Matters

**Better for Your Mental Health:**
- **Less pressure than LinkedIn** - No polished personal branding required. Just show what you're actually working on.
- **More meaningful than Tinder** - Connections are based on shared interests and skills, not appearances or status.
- **Reduces comparison anxiety** - See real people doing real projects, not curated highlight reels.
- **Authentic interactions** - Build genuine professional relationships in a more relaxed, human way.

**More Accessible Networking:**
- Removes the gatekeeping and credential barriers of traditional platforms
- First-gen professionals and career changers can show their actual work, not just their resume
- Bootcamp grads, self-taught developers, and non-traditional learners compete on skills and projects
- Lower barrier to entry means more people can build meaningful professional networks

**Creates Real Collaboration:**
- Swipe on projects and people you want to collaborate with
- Find partners who share your interests and work style
- Build together in a community that values authentic connection over status

## Tech Stack

### Frontend
- **React** (with TypeScript for better type safety)
- **Next.js 14+** (App Router) - handles routing, API routes, and server components
- **Tailwind CSS + shadcn/ui** - for UI components and styling
- **Framer Motion** - for swipe animations

### Backend
- **Next.js API Routes** - no need for separate backend server
- **Node.js** (built into Next.js)

### Database & Storage
- **Supabase (PostgreSQL)** - database, authentication, real-time subscriptions, and file storage
- **Supabase Auth** - built-in authentication with Google, GitHub, and email support

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Git installed
- Supabase account (free tier available)

### For Team Members

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to project directory**
   ```bash
   cd netwith
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   - Navigate to `http://localhost:3000`

