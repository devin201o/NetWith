import { supabase } from './supabase';

export async function seedSampleUsers() {
  const sampleUsers = [
    {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      bio: 'Passionate about building innovative solutions and connecting with talented professionals.',
      skills: '["React", "TypeScript", "Node.js", "Python"]',
      interests: '["Technology", "Innovation", "Startups"]',
      experience: '[{"id": 1, "title": "Senior Software Engineer", "company": "Google", "period": "2022 - Present", "description": "Leading development of core platform features"}]',
      education: 'BS Computer Science - Stanford',
      looking_for: 'network',
      swiped: false
    },
    {
      email: 'mike@example.com',
      name: 'Mike Chen',
      bio: 'Product leader with a passion for user experience.',
      skills: '["Product Strategy", "Analytics", "Leadership"]',
      interests: '["UX", "Data", "Team Building"]',
      experience: '[{"id": 1, "title": "Product Manager", "company": "Meta", "period": "2021 - Present", "description": "Leading product development"}]',
      education: 'MBA - Harvard Business School',
      looking_for: 'partner',
      swiped: false
    },
    {
      email: 'emily@example.com',
      name: 'Emily Rodriguez',
      bio: 'Creating beautiful, intuitive designs that users love.',
      skills: '["Figma", "UI/UX", "Design Systems", "Prototyping"]',
      interests: '["Design", "Art", "User Research"]',
      experience: '[{"id": 1, "title": "UX Designer", "company": "Apple", "period": "2021 - Present", "description": "Designing next-gen products"}]',
      education: 'BFA Design - RISD',
      looking_for: 'mentor',
      swiped: false
    }
  ];

  // First, clear existing sample users
  await supabase
    .from('users')
    .delete()
    .in('email', sampleUsers.map(u => u.email));

  // Insert new sample users
  const { data, error } = await supabase
    .from('users')
    .insert(sampleUsers)
    .select();

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Sample users created:', data);
  }
}