'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '@/store/useResumeStore';
import { Certification } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toMonthInput, fromMonthInput, isValidDateRange } from '@/lib/dateUtils';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { generateId } from '@/lib/ids';

const certDateSchema = z.object({
  date: z.string(),
  expiryDate: z.string(),
}).refine(
  (d) => isValidDateRange(d.date, d.expiryDate || 'Present'),
  { message: 'Expiry must be after issue date', path: ['expiryDate'] },
);

function CertEntry({ cert, onUpdate, onRemove }: {
  cert: Certification;
  onUpdate: (data: Partial<Certification>) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const { formState: { errors }, setValue, trigger } = useForm({
    resolver: zodResolver(certDateSchema),
    defaultValues: { date: cert.date, expiryDate: cert.expiryDate ?? '' },
    mode: 'onChange',
  });

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-sm font-medium flex-1 text-left">
          {cert.name || 'New Certification'}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-3 mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label className="text-sm">Certification Name</Label>
            <Input placeholder="AWS Solutions Architect" value={cert.name} onChange={(e) => onUpdate({ name: e.target.value })} />
          </div>
          <div>
            <Label className="text-sm">Issuing Organization</Label>
            <Input placeholder="Amazon Web Services" value={cert.issuer} onChange={(e) => onUpdate({ issuer: e.target.value })} />
          </div>
          <div>
            <Label className="text-sm">Date Earned</Label>
            <Input
              type="month"
              value={toMonthInput(cert.date)}
              onChange={(e) => {
                const display = fromMonthInput(e.target.value);
                onUpdate({ date: display });
                setValue('date', display);
                trigger(['date', 'expiryDate']);
              }}
            />
          </div>
          <div>
            <Label className="text-sm">Expiry Date (optional)</Label>
            <Input
              type="month"
              value={toMonthInput(cert.expiryDate)}
              onChange={(e) => {
                const display = fromMonthInput(e.target.value);
                onUpdate({ expiryDate: display });
                setValue('expiryDate', display);
                trigger(['date', 'expiryDate']);
              }}
              className={errors.expiryDate ? 'border-red-400' : ''}
            />
            {errors.expiryDate && (
              <p className="text-xs text-red-500 mt-0.5">{errors.expiryDate.message as string}</p>
            )}
          </div>
          <div>
            <Label className="text-sm">Credential ID (optional)</Label>
            <Input placeholder="ABC123XYZ" value={cert.credentialId} onChange={(e) => onUpdate({ credentialId: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm">URL (optional)</Label>
            <Input type="url" placeholder="https://credential.verify.com/..." value={cert.url} onChange={(e) => onUpdate({ url: e.target.value })} />
          </div>
        </div>
      )}
    </Card>
  );
}

export default function CertificationsForm() {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResumeStore();

  const handleAdd = () => {
    addCertification({
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Certifications</h3>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {resumeData.certifications.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <Award className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No certifications added yet.</p>
          <Button onClick={handleAdd} size="sm" variant="outline" className="mt-3 gap-1.5">
            <Plus className="h-4 w-4" /> Add Your First Certification
          </Button>
        </Card>
      )}

      <div className="space-y-3">
        {resumeData.certifications.map((cert) => (
          <CertEntry
            key={cert.id}
            cert={cert}
            onUpdate={(data) => updateCertification(cert.id, data)}
            onRemove={() => removeCertification(cert.id)}
          />
        ))}
      </div>

      {resumeData.certifications.length > 0 && (
        <Button onClick={handleAdd} size="sm" variant="outline" className="w-full gap-1.5 border-dashed">
          <Plus className="h-4 w-4" /> Blank line
        </Button>
      )}
    </div>
  );
}
