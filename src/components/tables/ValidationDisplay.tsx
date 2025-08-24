'use client';
import React from 'react';
import { ValidationResult } from '@/types';

interface ValidationDisplayProps {
  validationResult: ValidationResult;
}

const ValidationDisplay: React.FC<ValidationDisplayProps> = ({ validationResult }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">Validation Result</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Valid:</span> 
          <span className={`ml-2 font-semibold ${
            validationResult.valid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validationResult.valid ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <span className="font-medium">Proof Layers:</span> 
          <span className="ml-1">{validationResult.proof_layers}</span>
        </div>
        {validationResult.error_message && (
          <div className="col-span-2">
            <span className="font-medium text-red-600">Error:</span> 
            <span className="ml-1 text-red-600">{validationResult.error_message}</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <span className="font-medium text-sm">Computed Root:</span>
        <div 
          className="mt-1 font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded break-all"
          title={validationResult.root}
        >
          {validationResult.root}
        </div>
      </div>
    </div>
  );
};

export default ValidationDisplay;       