'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto lg:ml-64">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <img 
              src="/qproof_logo.png" 
              alt="QProof Logo" 
              className="w-6 h-6"
            />
            <span className="text-sm text-gray-600">
              QProof Explorer v1.0.0
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <a 
              href="#" 
              className="hover:text-[#00CA65] transition-colors"
            >
              API Documentation
            </a>
            <a 
              href="#" 
              className="hover:text-[#00CA65] transition-colors"
            >
              GitHub Repository
            </a>
            <a 
              href="/about" 
              className="hover:text-[#00CA65] transition-colors"
            >
              About
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            ⚡ QProof Explorer - Verifiable Bitcoin Provenance, Made Simple
          </p>
        </div>
      </div>
    </footer>
  );
}

