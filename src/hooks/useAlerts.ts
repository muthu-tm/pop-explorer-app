'use client';
import { useState, useCallback } from 'react';
import { AlertState } from '@/types';

export const useAlerts = () => {
  const [errorAlert, setErrorAlert] = useState<AlertState>({ show: false, message: '' });
  const [successAlert, setSuccessAlert] = useState<AlertState>({ show: false, message: '' });

  const showError = useCallback((message: string) => {
    setErrorAlert({ show: true, message });
    setTimeout(() => {
      setErrorAlert({ show: false, message: '' });
    }, 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccessAlert({ show: true, message });
    setTimeout(() => {
      setSuccessAlert({ show: false, message: '' });
    }, 3000);
  }, []);

  const clearError = useCallback(() => {
    setErrorAlert({ show: false, message: '' });
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccessAlert({ show: false, message: '' });
  }, []);

  const clearAlerts = useCallback(() => {
    clearError();
    clearSuccess();
  }, [clearError, clearSuccess]);

  return {
    errorAlert,
    successAlert,
    showError,
    showSuccess,
    clearError,
    clearSuccess,
    clearAlerts,
  };
};