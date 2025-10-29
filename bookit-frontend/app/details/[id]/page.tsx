// app/details/[id]/page.tsx
import ExperienceDetailsClient from '@/app/components/ExperienceDetailsClient';
import { IExperienceDetails } from '@/app/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Added fallback for preview

// This is the data-fetching function
async function getExperienceDetails(id: string): Promise<IExperienceDetails | null> {
  if (!API_URL) {
    console.error('API URL is not defined.');
    return null;
  }
  try {
    // Fetch from your environment variable
    const res = await fetch(`${API_URL}/api/experiences/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch experience details (status: ${res.status})`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
}

// The Page component
// --- CORRECTED PARAMS TYPE ---
export default async function DetailsPage({ params }: { params: { id: string } }) {
  // const { id } = await params; // No need to await params directly
  const { id } = params;

  const experience = await getExperienceDetails(id);

  if (!experience) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Experience not found or API error.</h1>
        <p className="text-gray-600">Please check the console for details.</p>
      </main>
    );
  }

  // It passes the server-fetched data as a prop
  return <ExperienceDetailsClient experience={experience} />;
}
