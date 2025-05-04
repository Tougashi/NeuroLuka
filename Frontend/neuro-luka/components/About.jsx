import React from 'react'

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
      <div className="mb-8">
        <span className="inline-block px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-medium text-sm">
          AI-Powered Innovation
        </span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
      Discover the Power of Smart Wound Analysis
      </h1>
      
      <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-16">
        Faster decisions, smarter care—analyze wounds and predict recovery in one tap
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-500 text-left">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Accurate Wound Size Estimation</h2>
          <p className="text-gray-600">
            Get precise measurements of wound area using advanced image processing and double integral calculations.
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-500 text-left">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Tissue Classification</h2>
          <p className="text-gray-600">
            Identify different tissue types within wounds to guide appropriate treatment strategies.
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-500 text-left">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Automated Wound Detection</h2>
          <p className="text-gray-600">
            Simply upload a wound image, and the system will automatically detect and highlight the affected area using AI technology.
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-500 text-left">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Recovery Prediction</h2>
          <p className="text-gray-600">
            Get data-driven healing timeline estimates based on wound characteristics and patient factors.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 py-12">
      <h2 className="text-2xl font-semibold px-8 text-center py-10">Why Choose Us?</h2>
      <div className="bg-gray-300 py-8 px-6 text-left ">
        <p className="text-xl">
          A Complete Solution for Efficient and <br />
          Accurate Wound Management
        </p>
      </div>
    </div>
  
    </div>
  )
}

export default About