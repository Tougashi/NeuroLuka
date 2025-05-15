'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function WoundAnalysis() {


  const [woundData, setWoundData] = useState({
    id: 1,
    imageUrl: '/api/placeholder/320/240', // Placeholder until we load from DB
    size: '4.2 cm',
    recoveryTime: '10 - 14 days',
    healingProgress: 'Early stage healing. Signs of initial scabbing present. The wound appears clean with some redness around the edges, which is normal at this stage.',
    recommendation: 'Keep the area clean and dry. Apply antiseptic ointment twice daily. Cover with a sterile bandage and change dressing daily. Avoid activities that could reopen the wound.'
  });
  
  const [loading, setLoading] = useState(true);

  // Simulate fetching wound data from the database
  useEffect(() => {
    const fetchWoundData = async () => {
      try {
        // In a real application, you would fetch data from your API here
        // const response = await fetch(`/api/wounds/${woundId}`);
        // const data = await response.json();
        // setWoundData(data);
        
        // Simulating API call with timeout
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching wound data:', error);
        setLoading(false);
      }
    };

    fetchWoundData();
  }, []);

  return (
  <div>
    <Navbar />
    <div className="max-w-5xl mx-auto mt-16">
      
      <h1 className="md:text-6xl text-2xl font-semibold text-center text-gray-900 mb-10"> Analisis luka</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column - Wound Image */}
        <div className="flex justify-center items-start">
          <div className="border-4 border-blue-500 rounded-lg overflow-hidden">
            {loading ? (
              <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                <p className="text-gray-500">Loading image...</p>
              </div>
            ) : (
              <div className="relative w-full h-64">
                <Image 
                  src={woundData.imageUrl}
                  alt="Wound image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Wound Information */}
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Wound Size */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Wound Size</h2>
              <p className="text-xl font-bold">{woundData.size}</p>
            </div>
            
            {/* Recovery Time */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Recovery Time</h2>
              <p className="text-xl font-bold">{woundData.recoveryTime}</p>
            </div>
          </div>
          
          {/* Healing Progress */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Healing Progress</h2>
            <p className="text-gray-700">{woundData.healingProgress}</p>
          </div>
          
          {/* Recommendation */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Recommendation</h2>
            <p className="text-gray-700">{woundData.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}