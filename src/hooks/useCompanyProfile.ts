
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CompanyProfile } from "@/components/profile/CompanyProfileForm";

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, which is fine
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        setProfile(data as CompanyProfile);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, refetch: fetchCompanyProfile };
};
