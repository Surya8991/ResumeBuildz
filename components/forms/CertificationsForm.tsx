'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Certification } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toMonthInput, fromMonthInput } from '@/lib/dateUtils';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { generateId } from '@/lib/ids';

function CertEntry({ cert, onUpdate, onRemove }: {
  cert: Certification;
  onUpdate: (data: Partial<Certification>) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

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
            <Input type="month" value={toMonthInput(cert.date)} onChange={(e) => onUpdate({ date: fromMonthInput(e.target.value) })} />
          </div>
          <div>
            <Label className="text-sm">Expiry Date (optional)</Label>
            <Input type="month" value={toMonthInput(cert.expiryDate)} onChange={(e) => onUpdate({ expiryDate: fromMonthInput(e.target.value) })} />
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
        <p className="text-sm text-muted-foreground text-center py-8">
          No certifications added yet. Click &quot;Add&quot; to get started.
        </p>
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
    </div>
  );
}
