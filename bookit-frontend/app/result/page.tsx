"use client";

import { useEffect, useState } from 'react';

function ResultDisplay() {
  
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // Fallback for preview environment
    const params = new URLSearchParams(window.location.search);
    setStatus(params.get('status'));
    setMessage(params.get('message'));
  }, []);

  // --- Success State ---
  if (status === 'success') {
    return (
      <div className="bg-[#F9F9F9] p-10 rounded-lg shadow-xl text-center max-w-md mx-auto">
        {/* Green Checkmark Icon */}
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mt-6">Booking Confirmed</h1>
        
        {/* Mocked Ref ID */}
        <p className="mt-2 text-lg text-gray-500">
          Ref ID: HUF56&SO
        </p>
        
        <a 
          href="/" 
          className="mt-8 inline-block bg-gray-200 text-gray-800 py-3 px-10 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  // --- Error State ---
  // Styled to match the new minimal design
  if (status === 'error') {
    return (
      <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-md mx-auto">
        {/* Red X Icon */}
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mt-6">Booking Failed</h1>
        
        {/* Display the specific error message */}
        {message && (
          <p className="mt-4 text-md text-gray-700">
            <strong>Reason:</strong> {message}
          </p>
        )}
        
        <a 
          href="/" 
          className="mt-8 inline-block bg-gray-200 text-gray-800 py-3 px-10 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }
  
  // --- Loading State ---
  return <p>Loading result...</p>;
}

// --- Main Page Component ---
export default function ResultPage() {
  return (
    // Updated main to have a light gray background and center content
    <main className="bg-[#F7F7F7] w-full min-h-screen p-4 flex items-center justify-center">
      {/* <Suspense fallback={<p>Loading result...</p>}>
          <ResultDisplay />
        </Suspense> 
      */}
      {/* Removed Suspense for preview compatibility */}
      <ResultDisplay />
    </main>
  );
}

