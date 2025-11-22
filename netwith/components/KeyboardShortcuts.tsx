import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function KeyboardShortcuts() {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
      <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-8 py-3 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Previous</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Next</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">Space</div>
          <span className="text-sm text-gray-600">Like</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">Enter</div>
          <span className="text-sm text-gray-600">Super Like</span>
        </div>
      </div>
    </div>
  );
}