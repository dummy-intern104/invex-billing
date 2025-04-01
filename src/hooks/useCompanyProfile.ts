
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CompanyProfile } from "@/components/profile/CompanyProfileForm";
import { useAuth } from "@/context/AuthContext";

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCompanyProfile();
    }
  }, [user]);

  const fetchCompanyProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use the "any" type assertion to bypass TypeScript's type checking for the table name
      // This is needed because the Supabase types don't include the company_profiles table yet
      const { data, error } = await (supabase
        .from('company_profiles' as any)
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single());

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, create a default profile for this user
          const defaultProfile = {
            company_name: "Marzelet Info Technology",
            address: "Ground floor Old no.33, New No 10 Andavar Street, Sivashakthi Nagar, Chennai",
            phone: "9629997391",
            email: user.email || "admin@marzelet.info",
            gstin: "33AASCSM2238G1ZJ",
            state: "33-Tamil Nadu",
            bank_name: "INDIAN OVERSEAS BANK, CHENNAI, AVADI",
            account_number: "00080200000163",
            ifsc_code: "IOBA0000008",
            account_holder_name: "Marzelet Info Technology Pvt Ltd",
            logo_url: "",
            signature_url: "",
            user_id: user.id
          };
          
          const { error: insertError } = await (supabase
            .from('company_profiles' as any)
            .insert(defaultProfile));
            
          if (insertError) {
            throw insertError;
          }
          
          setProfile(defaultProfile as unknown as CompanyProfile);
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

  const updateProfile = async (updatedProfile: Partial<CompanyProfile>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await (supabase
        .from('company_profiles' as any)
        .update(updatedProfile)
        .eq('user_id', user.id));
        
      if (error) throw error;
      
      // Refetch to get the updated profile
      await fetchCompanyProfile();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating company profile:', error);
      setError(error as Error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, refetch: fetchCompanyProfile, updateProfile };
};
