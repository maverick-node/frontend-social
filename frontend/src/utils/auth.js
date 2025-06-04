// Authentication error handler utility
import router from '../router';

export const handleAuthError = (error) => {
  // Check if error is due to unauthorized/unauthenticated status
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    console.error('Authentication error:', error);
    router.push('/login');
    return true;
  }
  return false;
};

// Wrapper for fetch calls to handle auth errors
export const authenticatedFetch = async (url, options = {}) => {
  try {
    // Ensure credentials are included
    const fetchOptions = {
      ...options,
      credentials: 'include',
    };

    const response = await fetch(url, fetchOptions);
    
    // Handle unauthorized/forbidden responses
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication error:', response.statusText);
      router.push('/login');
      throw new Error('Authentication failed');
    }

    return response;
  } catch (error) {
    // Handle network errors or other issues
    handleAuthError(error);
    throw error;
  }
}; 