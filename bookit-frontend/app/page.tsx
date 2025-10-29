// All 'next/...' imports are now active for your real deployment.
import Image from 'next/image';
import Link from 'next/link';

// 1. Define the type for an Experience
interface IExperience {
  _id: string; 
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
}
// --- THIS IS THE FIX ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 2. Helper function to fetch data
async function getExperiences(): Promise<IExperience[]> {
  try {
    // Fetch from your new environment variable
    const res = await fetch(`${API_URL}/api/experiences`, {
      cache: 'no-store', // Always get fresh data
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return []; // Return an empty array on error
  }
}

// --- UPDATED HEADER COMPONENT ---
function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo Image */}
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center">
            {/* Using Next.js Image component for optimization */}
            <Image
              src="/images/logo.jpeg" // This path assumes your logo is in /public/images/logo.jpeg
              alt="Highway Delite Logo"
              width={160} // Set the actual width of your logo
              height={40} // Set the actual height of your logo
              className="h-10 w-auto" // Tailwind classes for responsive height
              priority // Prioritize loading the logo
            />
          </a>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-8">
          <input
            type="search"
            placeholder="Search experiences..." 
            className="w-full py-2 px-4 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg focus:outline-none focus:bg-white focus:border-gray-400"
          />
        </div>

        {/* Search Button */}
        <div>
          <button className="bg-yellow-400 text-black font-semibold py-2 px-5 rounded-lg border border-yellow-500 hover:bg-yellow-500 transition-colors">
            Search
          </button>
        </div>
      </nav>
    </header>
  );
}
// --- END OF HEADER ---

// 3. Update the Home component to be async
export default async function Home() {
  // Fetch data when the page loads on the server
  const experiences = await getExperiences();

  return (
    <div className="bg-white min-h-screen">
      <Header /> {/* <-- This will now use the fixed Header */}
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Check if there are no experiences */}
        {experiences.length === 0 && (
          <p className="text-center text-gray-500">
            No experiences found. Is the backend server running?
          </p>
        )}

        {/* 4. Grid layout for the experience cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Image */}
              <img
                src={exp.image_url}
                alt={exp.title}
                className="w-full h-48 object-cover"
              />
              
              {/* Content */}
              <div className="p-4">
                {/* Title Row */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">{exp.title}</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                    {exp.location}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-500 mt-2">
                  {exp.description || "Curated small-group experience. Certified guide."}
                </p>

                {/* Price & Button Row */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-500">From</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{exp.price.toFixed(0)}
                    </span>
                  </div>
                  
                  {/* Using Next.js Link for navigation */}
                  <Link href={`/details/${exp._id}`} className="block">
                    <button className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

