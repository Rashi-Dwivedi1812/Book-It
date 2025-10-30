// app/details/[id]/page.tsx
import ExperienceDetailsClient from '@/app/components/ExperienceDetailsClient';
import { IExperienceDetails } from '@/app/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL

// This is the data-fetching function
async function getExperienceDetails(id: string): Promise<IExperienceDetails | null> {
  try {
    const res = await fetch(`${API_URL}/api/experiences/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch experience details');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// The Page component
export default async function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ unwrap params promise

  const experience = await getExperienceDetails(id);

  if (!experience) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Experience not found.</h1>
      </main>
    );
  }

  // It passes the server-fetched data as a prop
  return <ExperienceDetailsClient experience={experience} />;
}