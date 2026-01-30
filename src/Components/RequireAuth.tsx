import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// export default function RequireAuth({ children }: { children: JSX.Element }) {
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('idToken')
  const location = useLocation()

  if (!token) {
    // redirect to login, preserving where we came from
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
