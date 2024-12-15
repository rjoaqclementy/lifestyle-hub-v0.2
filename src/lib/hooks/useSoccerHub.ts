import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export const useSoccerHub = () => {
  const [hubId, setHubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSoccerHubId = async () => {
      try {
        const { data, error } = await supabase
          .from('hubs')
          .select('id')
          .eq('name', 'soccer')
          .single();

        if (error) throw error;
        setHubId(data.id);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoccerHubId();
  }, []);

  return { hubId, loading, error };
};