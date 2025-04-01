
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { LogoSignatureUpload } from "./LogoSignatureUpload";
import { BusinessDetailsForm } from "./BusinessDetailsForm";
import { BankDetailsForm } from "./BankDetailsForm";
import { CompanyProfile } from "@/types/company";

const CompanyProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { profile, loading, updateProfile } = useCompanyProfile();
  const [formData, setFormData] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleUpdateFormData = (updates: Partial<CompanyProfile>) => {
    if (!formData) return;
    setFormData(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsLoading(true);

    try {
      const result = await updateProfile(formData);
      
      if (!result.success) throw new Error("Failed to update profile");

      toast({
        title: 'Profile saved',
        description: 'Company profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Save failed',
        description: 'There was an error saving the company profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo & Signature */}
      <LogoSignatureUpload 
        logoUrl={formData.logo_url}
        signatureUrl={formData.signature_url}
        onUpdateData={handleUpdateFormData}
      />

      <Separator />

      {/* Business Details */}
      <BusinessDetailsForm 
        businessData={formData}
        onChange={handleInputChange}
      />

      <Separator />

      {/* Bank Details */}
      <BankDetailsForm 
        bankData={formData}
        onChange={handleInputChange}
      />

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          "Save Company Profile"
        )}
      </Button>
    </form>
  );
};

export default CompanyProfileForm;
