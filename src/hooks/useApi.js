import { useState, useCallback } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock API responses based on endpoint
      let mockResponse;

      switch (endpoint) {
        case '/api/patients':
          if (options.method === 'GET') {
            mockResponse = {
              data: [
                {
                  id: 1,
                  name: 'Ahmad Surya',
                  nik: '3171234567890123',
                  phone: '081234567890',
                  email: 'ahmad.surya@email.com',
                  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
                  birthDate: '1990-05-15',
                  gender: 'Laki-laki',
                  bloodType: 'O+',
                  status: 'Aktif',
                  lastVisit: '2024-01-15',
                  medicalRecords: 5
                },
                {
                  id: 2,
                  name: 'Siti Aminah',
                  nik: '3172345678901234',
                  phone: '081345678901',
                  email: 'siti.aminah@email.com',
                  address: 'Jl. Thamrin No. 456, Jakarta Pusat',
                  birthDate: '1985-08-22',
                  gender: 'Perempuan',
                  bloodType: 'A+',
                  status: 'Aktif',
                  lastVisit: '2024-01-10',
                  medicalRecords: 8
                },
                {
                  id: 3,
                  name: 'Budi Santoso',
                  nik: '3173456789012345',
                  phone: '081456789012',
                  email: 'budi.santoso@email.com',
                  address: 'Jl. Gatot Subroto No. 789, Jakarta Selatan',
                  birthDate: '1978-12-03',
                  gender: 'Laki-laki',
                  bloodType: 'B+',
                  status: 'Tidak Aktif',
                  lastVisit: '2023-11-20',
                  medicalRecords: 12
                }
              ],
              total: 3,
              page: 1,
              limit: 10
            };
          } else if (options.method === 'POST') {
            const newPatient = {
              id: Date.now(),
              ...options.body,
              status: 'Aktif',
              lastVisit: new Date().toISOString().split('T')[0],
              medicalRecords: 0
            };
            mockResponse = { data: newPatient };
          }
          break;

        case '/api/patients/search':
          mockResponse = {
            data: [
              {
                id: 1,
                name: 'Ahmad Surya',
                nik: '3171234567890123',
                phone: '081234567890',
                email: 'ahmad.surya@email.com',
                address: 'Jl. Sudirman No. 123, Jakarta Pusat',
                birthDate: '1990-05-15',
                gender: 'Laki-laki',
                bloodType: 'O+',
                status: 'Aktif',
                lastVisit: '2024-01-15',
                medicalRecords: 5
              }
            ],
            total: 1
          };
          break;

        default:
          mockResponse = { data: null };
      }

      return mockResponse;
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
    return apiCall(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data
    });
  }, [apiCall]);

  const put = useCallback((endpoint, data) => {
    return apiCall(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data
    });
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