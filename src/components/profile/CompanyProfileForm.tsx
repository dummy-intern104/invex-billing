import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Upload, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

export interface CompanyProfile {
  logo_url: string;
  signature_url: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  state: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  user_id?: string;
}

const initialCompanyProfile: CompanyProfile = {
  logo_url: "",
  signature_url: "",
  company_name: "Marzelet Info Technology",
  address: "Ground floor Old no.33, New No 10 Andavar Street, Sivashakthi Nagar, Chennai",
  phone: "9629997391",
  email: "admin@marzelet.info",
  gstin: "33AASCSM2238G1ZJ",
  state: "33-Tamil Nadu",
  bank_name: "INDIAN OVERSEAS BANK, CHENNAI, AVADI",
  account_number: "00080200000163",
  ifsc_code: "IOBA0000008",
  account_holder_name: "Marzelet Info Technology Pvt Ltd"
};

const CompanyProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CompanyProfile>(initialCompanyProfile);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const { profile, loading, updateProfile } = useCompanyProfile();

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'signature'
  ) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${type}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    setIsLoading(true);

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('company_assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('company_assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [type === 'logo' ? 'logo_url' : 'signature_url']: urlData.publicUrl
      }));

      toast({
        title: 'File uploaded',
        description: `${type === 'logo' ? 'Logo' : 'Signature'} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the file.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleRemoveImage = async (type: 'logo' | 'signature') => {
    setFormData(prev => ({
      ...prev,
      [type === 'logo' ? 'logo_url' : 'signature_url']: ''
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo & Signature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-gray-700 dark:text-gray-200 font-medium">Company Logo</Label>
          <div className="flex items-center gap-4">
            {formData.logo_url ? (
              <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
                <img
                  src={formData.logo_url}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white"
                    onClick={() => handleRemoveImage('logo')}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 border border-dashed rounded-md flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                  No logo uploaded
                </span>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="flex gap-2 items-center"
              onClick={() => logoInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" />
              {formData.logo_url ? 'Change Logo' : 'Upload Logo'}
            </Button>
            <input
              ref={logoInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo')}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-gray-700 dark:text-gray-200 font-medium">Signature</Label>
          <div className="flex items-center gap-4">
            {formData.signature_url ? (
              <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
                <img
                  src={formData.signature_url}
                  alt="Signature"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white"
                    onClick={() => handleRemoveImage('signature')}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 border border-dashed rounded-md flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                  No signature uploaded
                </span>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="flex gap-2 items-center"
              onClick={() => signatureInputRef.current?.click()}
              disabled={isLoading}
            >
              <Edit2 className="h-4 w-4" />
              {formData.signature_url ? 'Change Signature' : 'Upload Signature'}
            </Button>
            <input
              ref={signatureInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'signature')}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Business Details */}
      <div>
        <h3 className="text-lg font-medium mb-4">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              name="gstin"
              value={formData.gstin}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Bank Details */}
      <div>
        <h3 className="text-lg font-medium mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifsc_code">IFSC Code</Label>
            <Input
              id="ifsc_code"
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_holder_name">Account Holder's Name</Label>
            <Input
              id="account_holder_name"
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleInputChange}
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>
        </div>
      </div>

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
