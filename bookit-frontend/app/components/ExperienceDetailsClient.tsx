"use client"; // This is a Client Component

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // <-- 1. Uncommented this
// Corrected import paths for preview environment
import { IExperienceDetails, ISlot } from './../types';
import { useBookingStore } from './../store/bookingStore';

// --- Reusable Header Component (from homepage) ---
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

// --- Helper Functions for Dates & Times ---
const formatDateChip = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTimeChip = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// --- Group Slots by Date ---
// This function transforms the flat slots array into a structured Map
const groupSlotsByDate = (slots: ISlot[]) => {
  const grouped = new Map<string, ISlot[]>();
  const sortedSlots = [...slots].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  for (const slot of sortedSlots) {
    if (slot.is_booked) continue; // Only show available slots
    
    const dateKey = new Date(slot.start_time).toDateString(); // e.g., "Thu Nov 20 2025"
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)?.push(slot);
  }
  return grouped;
};

// --- Main Component ---
export default function ExperienceDetailsClient({ experience }: { experience: IExperienceDetails }) {
  const router = useRouter(); // <-- 2. Uncommented this
  const setBooking = useBookingStore((state) => state.setBooking);

  // --- State ---
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ISlot | null>(null);
  const [quantity, setQuantity] = useState(1);

  // --- Memos for Data ---
  // Group slots by date, e.g., {"Nov 20, 2025" => [slot1, slot2]}
  const groupedSlots = useMemo(() => groupSlotsByDate(experience.slots), [experience.slots]);
  const availableDates = useMemo(() => Array.from(groupedSlots.keys()), [groupedSlots]);
  
  // Get slots for the selected date
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return groupedSlots.get(selectedDate) || [];
  }, [selectedDate, groupedSlots]);

  // --- Logic ---
  // Set default date if not set
  if (!selectedDate && availableDates.length > 0) {
    setSelectedDate(availableDates[0]);
  }

  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey);
    setSelectedSlot(null); // Reset slot when date changes
  };

  const handleSlotSelect = (slot: ISlot) => {
    setSelectedSlot(slot);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount)); // Ensure quantity is at least 1
  };

  const handleBookNow = () => {
    if (!selectedSlot) {
      console.warn('Please select a time slot first.');
      return;
    }
    // Note: We're not passing quantity to the store, but you could add it
    setBooking(experience, selectedSlot);
    router.push('/checkout'); // <-- 3. Changed this back to router.push
  };

  // --- Price Calculations ---
  // Mocking tax for ₹59
  const TAX_MOCK = 59; 
  const basePrice = experience.price;
  const subtotal = basePrice * quantity;
  const taxes = TAX_MOCK * quantity; // Tax scales with quantity
  const total = subtotal + taxes;

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="container mx-auto p-4 sm:px-6 lg:px-8 py-6">
        {/* Back Link */}
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Details
        </a>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* --- Left Column --- */}
          <div className="lg:col-span-2">
            {/* Image */}
            <img
              src={experience.image_url}
              alt={experience.title}
              className="w-full h-auto aspect-[16/9] object-cover rounded-xl shadow-lg"
            />
            {/* Title */}
            <h1 className="text-4xl font-bold mt-6">{experience.title}</h1>
            {/* Description */}
            <p className="text-gray-600 mt-4 text-base">
              {experience.description || "Curated small-group experience. Certified guide. Safety first with gear included."}
            </p>
            
            {/* --- Date Selector --- */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Choose date</h2>
              <div className="flex flex-wrap gap-3">
                {availableDates.length > 0 ? availableDates.map((dateKey) => (
                  <button
                    key={dateKey}
                    onClick={() => handleDateSelect(dateKey)}
                    className={`py-2 px-5 rounded-lg font-medium transition-colors border-2
                      ${selectedDate === dateKey
                        ? 'bg-yellow-400 border-yellow-400 text-black'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {formatDateChip(dateKey)}
                  </button>
                )) : (
                  <p className="text-gray-500">No available dates.</p>
                )}
              </div>
            </div>

            {/* --- Time Selector --- */}
            {/* This section is updated to match your new image */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Choose time</h2>
              <div className="flex flex-wrap gap-3">
                {slotsForSelectedDate.length > 0 ? slotsForSelectedDate.map((slot, index) => {
                  const isSelected = selectedSlot?._id === slot._id;
                  // Mocking remaining slots data
                  const remaining = [4, 2, 5][index % 3] || 1; 
                  
                  return (
                    <button
                      key={slot._id}
                      onClick={() => handleSlotSelect(slot)}
                      className={`py-2 px-4 rounded-lg text-left transition-colors border-2
                        ${isSelected
                          ? 'bg-yellow-400 border-yellow-400 text-black'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="font-medium">{formatTimeChip(slot.start_time)}</span>
                      <span className="block text-xs text-red-500">{remaining} left</span>
                    </button>
                  );
                }) : (
                  <p className="text-gray-500">Please select a date to see times.</p>
                )}
                {/* Mocked Sold Out */}
                <button
                  disabled
                  className="py-2 px-4 rounded-lg text-left border-2 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  <span className="font-medium">1:00 PM</span>
                  <span className="block text-xs">Sold out</span>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">All times are in local time.</p>
            </div>
            
            {/* --- About Section --- */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </p>
            </div>
          </div>

          {/* --- Right Column (Price Box) --- */}
          {/* This section is updated to match your new image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-[#EFEFEF] border border-gray-200 rounded-lg shadow-lg p-6">
              
              {/* Price Calculations */}
              <div className="space-y-4">
                {/* Starts at */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Starts at</span>
                  <span className="font-semibold text-[#161616]">₹{basePrice.toFixed(0)}</span>
                </div>

                {/* Quantity */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleQuantityChange(-1)} 
                      className="text-2xl font-medium text-gray-500 hover:text-black disabled:text-gray-300"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="text-lg font-medium w-6 text-center">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)} 
                      className="text-2xl font-medium text-gray-500 hover:text-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-[#161616]">₹{subtotal.toFixed(0)}</span>
                </div>

                {/* Taxes */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold text-[#161616]">₹{taxes.toFixed(0)}</span>
                </div>
              </div>
              
              {/* Total */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#161616]">Total</span>
                  <span className="text-2xl font-bold text-[#161616]">₹{total.toFixed(0)}</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedSlot}
                className="w-full bg-[#D7D7D7] text-[#7F7F7F] font-semibold py-3 px-6 rounded-lg text-lg mt-6
                           transition-colors
                           enabled:bg-yellow-400 enabled:text-black enabled:hover:bg-yellow-500
                           disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}