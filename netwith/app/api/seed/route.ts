import { NextResponse } from 'next/server';
import { seedSampleUsers } from '@/lib/seedData';

export async function GET() {
  try {
    await seedSampleUsers();
    return NextResponse.json({ message: 'Sample users seeded successfully' });
  } catch (error) {
    console.error('Error seeding:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}