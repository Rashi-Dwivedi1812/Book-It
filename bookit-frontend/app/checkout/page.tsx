"use client";

import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Removed for preview compatibility
// Corrected import path for preview
import { useBookingStore } from './../store/bookingStore'; 
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL

// --- Reusable Header Component ---
function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo Image */}
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center">
            {/* Replaced Next.js <Image> with standard <img> for preview compatibility.
              In your local project, use the <Image> component for optimization.
            */}
            <img
              src="/images/logo.jpeg" // This path assumes your logo is in /public/images/logo.jpeg
              alt="Highway Delite Logo"
              className="h-13 w-auto" // Set height and let width adjust automatically
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

// --- Helper Functions for Dates ---
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default function CheckoutPage() {
  // const router = useRouter(); // Removed for preview compatibility

  // 1. --- THIS IS THE FIX for the infinite loop ---
  const experience = useBookingStore((state) => state.experience);
  const slot = useBookingStore((state) => state.slot);
  const clearBooking = useBookingStore((state) => state.clearBooking);
  // --- END OF FIX ---

  // 2. Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreed, setAgreed] = useState(false); // New state for checkbox

  // 3. Price & loading state
  const [discount, setDiscount] = useState(0); 
  const [discountType, setDiscountType] = useState<'percent' | 'flat' | null>(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [isPromoLoading, setIsPromoLoading] = useState(false); 

  // 4. Redirect if no data
  useEffect(() => {
    const exp = useBookingStore.getState().experience;
    const s = useBookingStore.getState().slot;
    if (!exp || !s) {
      window.location.href = '/';
    }
  }, []); // Empty array, runs only on mount

  // 5. Calculate price (Updated for new UI)
  const MOCK_TAX = 59;
  const basePrice = experience?.price || 0;
  let subtotal = basePrice;

  if (discountType === 'percent') {
    subtotal = basePrice - (basePrice * discount);
  } else if (discountType === 'flat') {
    subtotal = basePrice - discount;
  }
  if (subtotal < 0) subtotal = 0; // Subtotal can't be negative

  const totalPrice = subtotal + MOCK_TAX;

  // --- Functions ---

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsPromoLoading(true);
    setPromoMessage('');
    try {
      const res = await axios.post(`${API_URL}/api/promo/validate`, {
        promoCode,
      });
      if (res.data.discount < 1) {
        setDiscountType('percent');
      } else {
        setDiscountType('flat');
      }
      setDiscount(res.data.discount);
      setPromoMessage('Promo code applied!');
    } catch (error) {
      setDiscount(0);
      setDiscountType(null);
      setPromoMessage('Invalid promo code.');
    } finally {
      setIsPromoLoading(false);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience || !slot || !name || !email) {
      alert('Please fill in your name and email.');
      return;
    }
    if (!agreed) {
      alert('You must agree to the terms and safety policy.');
      return;
    }
    
    setIsLoading(true);

    try {
      const bookingDetails = {
        experience_id: experience._id,
        slot_id: slot._id,
        user_name: name,
        user_email: email,
        promo_code: discount > 0 ? promoCode : undefined,
        final_price: totalPrice, // Send the final total
      };

      await axios.post(`${API_URL}/api/bookings`, bookingDetails);

      clearBooking();
      window.location.href = '/result?status=success';

    } catch (error: any) {
      let errorMessage = 'Booking failed. Please try again.';
      if (error.response && error.response.status === 409) {
        errorMessage = 'Sorry, this slot was just booked by someone else.';
      }
      window.location.href = `/result?status=error&message=${encodeURIComponent(errorMessage)}`;
    } finally {
      setIsLoading(false);
    }
  };

  if (!experience || !slot) {
    return (
      <main className="container mx-auto p-4 text-center">
        <p>Loading your booking...</p>
      </main>
    );
  }

  // --- NEW JSX ---
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto p-4 sm:px-6 lg:px-8 py-6">
        {/* Back Link */}
        <a href={`/details/${experience._id}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#000000] hover:text-gray-900 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Checkout
        </a>

        <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* --- LEFT SIDE: FORM --- */}
          <div className="lg:col-span-3 bg-[#F7F7F7] rounded-lg p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg bg-[#EFEFEF] border-0 p-3 text-gray-900 focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg bg-[#EFEFEF] border-0 p-3 text-gray-900 focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* --- Promo Code --- */}
            <div>
              <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-1">
                Promo code
              </label>
              <div className="flex mt-1">
                <input
                  type="text"
                  id="promo"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="block w-full rounded-l-lg bg-[#EFEFEF] border-0 p-3 text-gray-900 focus:ring-2 focus:ring-yellow-500 z-10"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={isPromoLoading}
                  className="relative -ml-1 inline-flex items-center space-x-2 rounded-r-lg bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-700"
                >
                  {isPromoLoading ? '...' : 'Apply'}
                </button>
              </div>
              {promoMessage && (
                <p className={`mt-2 text-sm ${discount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {promoMessage}
                </p>
              )}
            </div>

            {/* --- Checkbox --- */}
            <div className="flex items-center">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
              <label htmlFor="agree" className="ml-3 block text-sm text-gray-600">
                I agree to the terms and safety policy
              </label>
            </div>
          </div>

          {/* --- RIGHT SIDE: SUMMARY --- */}
          <div className="lg:col-span-2 bg-[#F7F7F7] rounded-lg p-8 h-fit sticky top-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-gray-900">{experience.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">{formatDate(slot.start_time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium text-gray-900">{formatTime(slot.start_time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Qty</span>
                <span className="font-medium text-gray-900">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium text-gray-900">₹{MOCK_TAX}</span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{totalPrice.toFixed(0)}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={isLoading || !agreed}
              className="w-full bg-[#FFD643] text-black font-semibold py-3 px-6 rounded-lg text-lg mt-6
                         hover:bg-[#FFD643] transition-colors
                         disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Pay and Confirm'}
            </button>
          </div>
          
        </form>
      </main>
    </div>
  );
}

