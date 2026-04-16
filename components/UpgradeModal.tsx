'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles, FileDown, Loader2 } from 'lucide-react';
import { FREE_LIMITS, type GatedFeature } from '@/lib/usage';
import { useCheckout } from '@/hooks/useCheckout';

const FEATURE_LABELS: Record<GatedFeature, { name: string; icon: typeof Sparkles }> = {
  ai: { name: 'AI Rewrites', icon: Sparkles },
  pdf: { name: 'PDF Exports', icon: FileDown },
};

interface UpgradeModalProps {
  feature: GatedFeature;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradeModal({ feature, open, onOpenChange }: UpgradeModalProps) {
  const { name } = FEATURE_LABELS[feature];
  const limit = FREE_LIMITS[feature];
  const { startCheckout, loading, error } = useCheckout();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Daily limit reached
          </DialogTitle>
          <DialogDescription>
            You&apos;ve used all {limit} free {name.toLowerCase()} for today. Upgrade to Pro for unlimited access.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 my-2">
          {/* Free tier */}
          <div className="rounded-lg border p-3 space-y-2">
            <p className="text-sm font-semibold">Free</p>
            <p className="text-xs text-muted-foreground">$0 / month</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 mt-0.5 shrink-0" />
                {FREE_LIMITS.ai} AI rewrite / day
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 mt-0.5 shrink-0" />
                {FREE_LIMITS.pdf} PDF exports / day
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 mt-0.5 shrink-0" />
                All templates
              </li>
            </ul>
          </div>

          {/* Pro tier */}
          <div className="rounded-lg border-2 border-primary p-3 space-y-2 relative">
            <span className="absolute -top-2.5 right-2 text-[10px] font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              POPULAR
            </span>
            <p className="text-sm font-semibold">Pro</p>
            <p className="text-xs text-muted-foreground">$9 / month</p>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                Unlimited AI rewrites
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                Unlimited PDF exports
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                Priority support
              </li>
            </ul>
          </div>
        </div>

        {error && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
            {error}
          </p>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm" />}>
            Maybe later
          </DialogClose>
          <Button size="sm" onClick={() => startCheckout('pro')} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crown className="h-3.5 w-3.5" />}
            {loading ? 'Redirecting...' : 'Upgrade to Pro'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
