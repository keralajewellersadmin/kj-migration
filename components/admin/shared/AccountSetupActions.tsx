'use client';

import React, { useState } from 'react';
import { useFormFields } from '@payloadcms/ui';

export default function AccountSetupActions() {
  const accountActivatedField = useFormFields(([fields]) => fields.accountActivated);
  const emailField = useFormFields(([fields]) => fields.email);
  const idField = useFormFields(([fields]) => fields.id);
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const accountActivated = accountActivatedField?.value === true;
  const email = emailField?.value as string;
  const id = idField?.value as string;

  if (!id || !email) return null;

  const handleAction = async (action: 'resend-setup' | 'reset-password') => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const endpoint = action === 'resend-setup' 
        ? '/api/auth/resend-setup' 
        : '/api/auth/forgot-password';
        
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || 'Action completed successfully.');
      } else {
        setErrorMessage(data.error || data.message || 'Failed to perform action.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '16px', background: 'var(--theme-bg)', border: '1px solid var(--theme-border)', borderRadius: '4px' }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Account Actions</h4>
      
      {!accountActivated ? (
        <div>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--theme-elevation-400)' }}>
            This account hasn&apos;t been activated yet. The user needs to set their password.
          </p>
          <button
            type="button"
            onClick={() => handleAction('resend-setup')}
            disabled={loading}
            className="btn btn--style-secondary btn--size-small"
          >
            {loading ? 'Sending...' : 'Resend Setup Email'}
          </button>
        </div>
      ) : (
        <div>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--theme-elevation-400)' }}>
            This account is fully active. You can trigger a password reset email if they are locked out.
          </p>
          <button
            type="button"
            onClick={() => handleAction('reset-password')}
            disabled={loading}
            className="btn btn--style-secondary btn--size-small"
          >
            {loading ? 'Sending...' : 'Send Password Reset Email'}
          </button>
        </div>
      )}

      {successMessage && <div style={{ marginTop: '12px', fontSize: '13px', color: 'green' }}>{successMessage}</div>}
      {errorMessage && <div style={{ marginTop: '12px', fontSize: '13px', color: 'red' }}>{errorMessage}</div>}
    </div>
  );
}
