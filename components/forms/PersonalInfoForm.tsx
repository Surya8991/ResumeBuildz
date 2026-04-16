'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Link, Globe, Code, Camera, X, Zap } from 'lucide-react';

function getValidationError(key: string, value: string): string | null {
  if (!value) return null; // Don't show errors for empty fields (just mark as required)
  switch (key) {
    case 'email':
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : null;
    case 'phone':
      return !/^[+\d][\d\s\-().]{6,}$/.test(value) ? 'Enter a valid phone number' : null;
    case 'linkedin':
      return value.length > 5 && !/^(https?:\/\/)?(www\.)?linkedin\.com\//i.test(value) ? 'Should be a linkedin.com URL' : null;
    case 'github':
      return value.length > 5 && !/^(https?:\/\/)?(www\.)?github\.com\//i.test(value) ? 'Should be a github.com URL' : null;
    default:
      return null;
  }
}

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resumeData;

  const fields = [
    { key: 'fullName' as const, label: 'Full Name', icon: User, placeholder: 'e.g. John Doe', required: true },
    { key: 'jobTitle' as const, label: 'Job Title', icon: User, placeholder: 'e.g. Senior Software Engineer' },
    { key: 'email' as const, label: 'Email', icon: Mail, placeholder: 'e.g. john@example.com', type: 'email', required: true },
    { key: 'phone' as const, label: 'Phone', icon: Phone, placeholder: 'e.g. +1 (555) 123-4567', type: 'tel', required: true },
    { key: 'location' as const, label: 'Location', icon: MapPin, placeholder: 'e.g. San Francisco, CA' },
    { key: 'linkedin' as const, label: 'LinkedIn', icon: Link, placeholder: 'e.g. linkedin.com/in/johndoe', type: 'url' },
    { key: 'website' as const, label: 'Website', icon: Globe, placeholder: 'e.g. johndoe.com', type: 'url' },
    { key: 'github' as const, label: 'GitHub', icon: Code, placeholder: 'e.g. github.com/johndoe', type: 'url' },
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Whitelist allowed image MIME types (no SVG to prevent embedded scripts)
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Only JPEG, PNG, WebP, or GIF images are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2MB');
      return;
    }
    // Magic-byte check: MIME type is spoofable by renaming. Verify actual
    // file bytes match one of the allowed image signatures.
    const { detectImageKind } = await import('@/lib/imageMagic');
    const kind = await detectImageKind(file);
    if (!kind) {
      alert('File does not appear to be a valid image. Please pick another.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result && result.startsWith('data:image/')) {
        updatePersonalInfo({ photo: result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Information</h3>

      {/* Photo upload */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {personalInfo.photo ? (
            <div className="relative">
              <img src={personalInfo.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-muted" />
              <button
                onClick={() => updatePersonalInfo({ photo: '' })}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/60 transition-colors">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Profile Photo</p>
          <p>Optional. Max 2MB. Shows on select templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ key, label, icon: Icon, placeholder, type, required }) => {
          const value = personalInfo[key];
          const error = getValidationError(key, value);
          return (
            <div key={key} className={key === 'fullName' || key === 'jobTitle' ? 'md:col-span-2' : ''}>
              <Label htmlFor={key} className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                {label}
                {required && <span className="text-red-500 text-xs">*</span>}
              </Label>
              <Input
                id={key}
                type={type || 'text'}
                placeholder={placeholder}
                value={value}
                onChange={(e) => updatePersonalInfo({ [key]: e.target.value })}
                autoComplete={key === 'fullName' ? 'name' : key === 'email' ? 'email' : key === 'phone' ? 'tel' : undefined}
                className={error ? 'border-red-400 focus-visible:ring-red-400' : ''}
              />
              {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
              {key === 'jobTitle' && value && value.length > 3 && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-primary">
                  <Zap className="h-3 w-3" />
                  <span>Tip: Use <strong>ATS → Smart Matching</strong> to find keywords for &quot;{value}&quot;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
