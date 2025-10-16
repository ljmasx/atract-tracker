import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Custom hook to load and manage all Supabase data
 * @returns {Object} { data, isLoading, loadData }
 */
export const useSupabaseData = () => {
  const [data, setData] = useState({
    generations: [],
    chefs: [],
    campaigns: [],
    assignments: [],
    tests: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [
        { data: generations },
        { data: chefs },
        { data: campaigns },
        { data: assignments },
        { data: tests }
      ] = await Promise.all([
        supabase.from('generations').select('*').order('id'),
        supabase.from('chefs').select('*').order('name'),
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('assignments').select('*'),
        supabase.from('tests').select('*').order('created_at', { ascending: false })
      ]);

      setData({
        generations: generations || [],
        chefs: chefs || [],
        campaigns: campaigns || [],
        assignments: assignments || [],
        tests: tests || []
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, isLoading, loadData };
};
