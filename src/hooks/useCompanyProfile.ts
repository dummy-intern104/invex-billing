
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
      // Use the "any" type assertion to bypass TypeScript's type checking for the table name
      // This is needed because the Supabase types don't include the company_profiles table yet
      const { data, error } = await (supabase
        .from('company_profiles' as any)
        .select('*')
        .limit(1)
        .single());

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, which is fine
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        // Use type assertion to safely convert the data to CompanyProfile
        setProfile(data as unknown as CompanyProfile);
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
