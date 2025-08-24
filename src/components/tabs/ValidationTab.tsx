'use client';
import React from 'react';
import { ValidationResult } from '@/types';
import { LoadingButton, EmptyState } from '@/components/ui';
import ValidationDisplay from '@/components/tables/ValidationDisplay';

interface ValidationTabProps {
  validationResult: ValidationResult | null;
  onValidateProof: () => void;
  isLoading: boolean;
}

const ValidationTab: React.FC<ValidationTabProps> = ({
  validationResult,
  onValidateProof,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Proof Validation</h3>
        <LoadingButton onClick={onValidateProof} isLoading={isLoading}>
          Validate Proof
        </LoadingButton>
      </div>
      
      {!validationResult ? (
        <EmptyState 
          message="No validation result. Use the search filters and click 'Validate Proof' to validate a proof chain."
        />
      ) : (
        <ValidationDisplay validationResult={validationResult} />
      )}
    </div>
  );
};

export default ValidationTab;