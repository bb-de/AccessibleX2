import React from "react";

export function DemoWebsite() {
  return (
    <div className="relative h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="font-bold text-xl text-gray-800">Demo Website</div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-600 hover:text-primary">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to our Website</h1>
        <p className="text-gray-600 mb-6">This is a demo website to showcase the accessibility widget functionality. The widget can help users with various disabilities navigate websites more effectively.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <svg className="w-full h-48 bg-gray-200 rounded mb-4" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
              <rect width="800" height="400" fill="#f3f4f6" />
              <text x="400" y="200" textAnchor="middle" dominantBaseline="middle" fontFamily="Arial" fontSize="24" fill="#6b7280">
                Professional using computer with accessibility features
              </text>
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h2>
            <p className="text-gray-600">We believe that the web should be accessible to everyone. Our accessibility widget helps make websites more usable for people with various disabilities.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <svg className="w-full h-48 bg-gray-200 rounded mb-4" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
              <rect width="800" height="400" fill="#f3f4f6" />
              <text x="400" y="200" textAnchor="middle" dominantBaseline="middle" fontFamily="Arial" fontSize="24" fill="#6b7280">
                Diverse group of people collaborating with technology
              </text>
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Inclusive Design</h2>
            <p className="text-gray-600">Our tools support WCAG 2.1 compliance and help create more inclusive web experiences that work for users with diverse abilities and needs.</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="text-lg font-semibold">Visual Adjustments</h3>
              </div>
              <p className="text-gray-600">Customize contrast, text size, and color schemes to improve readability.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="text-lg font-semibold">Screen Reader</h3>
              </div>
              <p className="text-gray-600">Text-to-speech functionality for users with visual impairments.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <h3 className="text-lg font-semibold">Keyboard Navigation</h3>
              </div>
              <p className="text-gray-600">Enhanced keyboard controls for users who cannot use a mouse.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary bg-opacity-10 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Try Our Accessibility Widget</h2>
          <p className="text-gray-700 mb-6">Our widget helps make websites more accessible for people with various disabilities. Click the accessibility icon in the bottom right corner to explore all the features.</p>
          <p className="text-gray-700">The widget includes:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Screen reader compatibility</li>
            <li>Color contrast adjustments</li>
            <li>Content scaling options</li>
            <li>Navigation assistance</li>
            <li>And many more features</li>
          </ul>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-neutral-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300">We provide accessibility solutions to make the web more inclusive for everyone.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">API Reference</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300 mb-2">Email: info@example.com</p>
              <p className="text-gray-300">Phone: +1 234 567 890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2023 Accessibility Widget. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
