import { useState, useCallback } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

// In useApi.js - Inside the `apiCall` function
const apiCall = useCallback(async (endpoint, options = {}) => {
  setLoading(true);
  setError(null);

  try {
    const baseURL = 'http://localhost:3001';
    const url = `${baseURL}${endpoint}`;

    // Prepare headers and body
    let headers = {
      ...options.headers,
    };

    let body = options.body;

    // If body is FormData, DO NOT set Content-Type manually.
    if (body instanceof FormData) {
      delete headers['Content-Type']; // Let browser set correct multipart/form-data header
      // Body is already FormData, no need to stringify
    } else if (body) {
      // For non-FormData bodies, set Content-Type to JSON and stringify
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: headers,
      credentials: 'include',
      body: body, // <-- Use the prepared body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    setError(err.message || 'Terjadi kesalahan saat mengambil data');
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

  const get = useCallback((endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiCall(url, { method: 'GET' });
  }, [apiCall]);

  const post = useCallback((endpoint, data) => {
    // Check if data contains files
    const hasFiles = data instanceof FormData ||
      (data && typeof data === 'object' && Object.values(data).some(value => value instanceof File));
    
    if (hasFiles) {
      // Handle file uploads with FormData
      const formData = data instanceof FormData ? data : new FormData();
      
      if (!(data instanceof FormData)) {
        Object.keys(data).forEach(key => {
          if (data[key] instanceof File) {
            formData.append(key, data[key]);
          } else {
            formData.append(key, data[key]);
          }
        });
      }
      
      return apiCall(endpoint, {
        method: 'POST',
        body: formData
      });
    } else {
      // Handle regular JSON data
      return apiCall(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data
      });
    }
  }, [apiCall]);

  const put = useCallback((endpoint, data) => {
    // Check if data contains files
    const hasFiles = data instanceof FormData ||
      (data && typeof data === 'object' && Object.values(data).some(value => value instanceof File));
    
    if (hasFiles) {
      // Handle file uploads with FormData
      const formData = data instanceof FormData ? data : new FormData();
      
      if (!(data instanceof FormData)) {
        Object.keys(data).forEach(key => {
          if (data[key] instanceof File) {
            formData.append(key, data[key]);
          } else {
            formData.append(key, data[key]);
          }
        });
      }
      
      return apiCall(endpoint, {
        method: 'PUT',
        body: formData
      });
    } else {
      // Handle regular JSON data
      return apiCall(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data
      });
    }
  }, [apiCall]);

  const del = useCallback((endpoint) => {
    return apiCall(endpoint, { method: 'DELETE' });
  }, [apiCall]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    clearError: () => setError(null)
  };
};

export default useApi;