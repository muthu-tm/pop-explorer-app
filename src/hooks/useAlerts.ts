'use client';
import { useState, useCallback } from 'react';
import { AlertState } from '@/types';

export const useAlerts = () => {
  const [errorAlert, setErrorAlert] = useState<AlertState>({
    show: false,
    message: '',
    type: 'error',
  });
  const [successAlert, setSuccessAlert] = useState<AlertState>({
    show: false,
    message: '',
    type: 'success',
  });

  const showError = useCallback((message: string) => {
    setErrorAlert({ show: true, message, type: 'error' });
    setTimeout(() => {
      setErrorAlert({ show: false, message: '', type: 'error' });
    }, 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccessAlert({ show: true, message, type: 'success' });
    setTimeout(() => {
      setSuccessAlert({ show: false, message: '', type: 'success' });
    }, 3000);
  }, []);

  const clearError = useCallback(() => {
    setErrorAlert({ show: false, message: '', type: 'error' });
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccessAlert({ show: false, message: '', type: 'success' });
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
