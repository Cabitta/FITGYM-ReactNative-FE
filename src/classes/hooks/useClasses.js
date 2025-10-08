import { useState, useEffect } from 'react';
import { getClases } from '../services/classesService';

export const useClasses = () => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClases = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getClases(filters);
      setClases(data);
    } catch (err) {
      setError('No se pudieron cargar las clases.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchClases();
  }, []);

  return { clases, loading, error, fetchClases };
};
