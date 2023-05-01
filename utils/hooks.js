import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('token');
    if (loggedInUser) {
      setIsAuthenticated(true);
      setLoading(false)
    }
    setLoading(false)
  }, []);

  return { isAuthenticated, loading };
};