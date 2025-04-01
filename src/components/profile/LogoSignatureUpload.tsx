
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { CompanyProfile } from "@/types/company";

interface LogoSignatureUploadProps {
  logoUrl: string;
  signatureUrl: string;
  onUpdateData: (updates: Partial<CompanyProfile>) => void;
}

export const LogoSignatureUpload: React.FC<LogoSignatureUploadProps> = ({
  logoUrl,
  signatureUrl,
  onUpdateData
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'signature'
  ) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    // Add user ID to file name to avoid collisions
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

      onUpdateData({
        [type === 'logo' ? 'logo_url' : 'signature_url']: urlData.publicUrl
      });

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

  const handleRemoveImage = (type: 'logo' | 'signature') => {
    onUpdateData({
      [type === 'logo' ? 'logo_url' : 'signature_url']: ''
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label className="text-gray-700 dark:text-gray-200 font-medium">Company Logo</Label>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
              <img
                src={logoUrl}
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
            {logoUrl ? 'Change Logo' : 'Upload Logo'}
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
          {signatureUrl ? (
            <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
              <img
                src={signatureUrl}
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
            {signatureUrl ? 'Change Signature' : 'Upload Signature'}
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
  );
};
