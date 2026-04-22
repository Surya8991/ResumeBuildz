'use client';

import { useState, useEffect } from 'react';
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
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Mail,
  Send,
  Users,
  MessageCircle,
} from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { encodeResume, ShareLinkTooLargeError } from '@/lib/shareLink';
import { SITE_URL } from '@/lib/siteConfig';
import { useToast } from '@/components/Toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type InviteMode = 'view' | 'copy';

export default function ShareResumeDialog({ open, onOpenChange }: Props) {
  const { resumeData } = useResumeStore();
  const { showToast } = useToast();
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [tooLargeError, setTooLargeError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMode, setInviteMode] = useState<InviteMode>('view');
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    // Intentional: reset UI state then kick off async encode when dialog opens.
    setLoading(true);
    setCopied(false);
    setInviteCopied(false);
    setInviteStatus(null);
    setTooLargeError(null);
    encodeResume(resumeData)
      .then((payload) => {
        // Use window.origin in dev so the link works locally; SITE_URL in prod.
        const base = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
        setUrl(`${base}/r#${payload}`);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err instanceof ShareLinkTooLargeError) {
          setTooLargeError(err.message);
        } else {
          setTooLargeError('Failed to generate share link. Please try again.');
        }
      });
  }, [open, resumeData]);

  const copyToClipboard = async (value: string, onSuccess: () => void) => {
    try {
      await navigator.clipboard.writeText(value);
      onSuccess();
    } catch {
      window.prompt('Copy this link:', value);
    }
  };

  const copyPublicLink = () => {
    copyToClipboard(url, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const base = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  const payload = url.split('#')[1] || '';
  const urlLen = url.length;
  const tooLong = urlLen > 2000;
  const payloadLen = urlLen - (base.length + '/r#'.length);
  const viewInviteUrl = payload ? `${base}/r?mode=view#${payload}` : '';
  const copyInviteUrl = payload ? `${base}/r?mode=copy#${payload}` : '';
  const inviteUrl = inviteMode === 'copy' ? copyInviteUrl : viewInviteUrl;
  const resumeName = resumeData.personalInfo.fullName || 'shared resume';
  const shareText = `View ${resumeName}'s resume on ResumeBuildz`;
  const socialLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
  };

  const copyInviteLink = () => {
    if (!inviteUrl) return;
    copyToClipboard(inviteUrl, () => {
      setInviteCopied(true);
      setInviteStatus('Invite link copied.');
      setTimeout(() => setInviteCopied(false), 2000);
    });
  };

  const sendInvite = async () => {
    const email = inviteEmail.trim();
    if (!email || !inviteUrl) return;
    setSendingInvite(true);
    setInviteStatus(null);
    try {
      const res = await fetch('/api/share/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          mode: inviteMode,
          url: inviteUrl,
          resumeName,
        }),
      });
      const data = await res.json().catch(() => null) as { emailSent?: boolean; error?: string } | null;
      if (res.ok && data?.emailSent) {
        setInviteStatus(`Invite sent to ${email}.`);
        showToast('Invite email sent.', 'success');
      } else {
        setInviteStatus(data?.error || 'Email is not configured. Copy the invite link instead.');
        showToast('Email not sent. Copy the invite link instead.', 'warning');
      }
    } catch {
      setInviteStatus('Email failed. Copy the invite link instead.');
      showToast('Email failed. Copy the invite link instead.', 'warning');
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Resume
          </DialogTitle>
          <DialogDescription>
            Share a read-only link, invite someone to view or copy their own editable duplicate, or post to social channels.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {tooLargeError ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-900">
              <p className="flex items-center gap-1.5 font-semibold mb-1">
                <AlertTriangle className="h-4 w-4" /> Resume too large to share as a link
              </p>
              <p className="text-xs">{tooLargeError}</p>
            </div>
          ) : (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
              <p className="flex items-center gap-1.5 font-semibold mb-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Your data lives in the URL
              </p>
              <p>
                Anyone with this link can view your resume. The URL fragment is never sent to our servers unless you send an email invite from here.
              </p>
            </div>
          )}

          <section className="rounded-xl border p-3 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">Public link</h3>
                <p className="text-xs text-muted-foreground">Read-only resume preview. Recipients cannot edit your original.</p>
              </div>
              <Button size="sm" disabled={loading || !url} onClick={() => window.open(url, '_blank')} className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> Preview
              </Button>
            </div>

            <div className="flex gap-2">
              <input
                readOnly
                value={loading ? 'Generating...' : url}
                className="flex-1 text-xs font-mono px-3 py-2 border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm" onClick={copyPublicLink} disabled={loading || !url} className="gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              URL length: {urlLen} chars · Payload: {payloadLen} chars
              {tooLong && <span className="text-amber-700 ml-2">Long link: some email clients may truncate it</span>}
            </p>
          </section>

          <section className="rounded-xl border p-3 space-y-3">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Invite people
              </h3>
              <p className="text-xs text-muted-foreground">Choose whether the recipient can only view or copy the resume into their own builder.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="text-sm px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={inviteMode}
                onChange={(e) => setInviteMode(e.target.value as InviteMode)}
                className="text-sm px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="view">View only</option>
                <option value="copy">Copy resume</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                readOnly
                value={loading ? 'Generating...' : inviteUrl}
                className="flex-1 text-xs font-mono px-3 py-2 border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="button" variant="outline" size="sm" onClick={copyInviteLink} disabled={loading || !inviteUrl} className="gap-1.5">
                {inviteCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Link
              </Button>
              <Button type="button" size="sm" onClick={sendInvite} disabled={loading || sendingInvite || !inviteEmail.trim() || !inviteUrl} className="gap-1.5">
                {sendingInvite ? <Mail className="h-3.5 w-3.5 animate-pulse" /> : <Send className="h-3.5 w-3.5" />}
                Send
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              {inviteMode === 'copy'
                ? 'Copy resume lets them edit a duplicate. Your original resume stays unchanged.'
                : 'View only opens the same read-only preview without a copy button.'}
            </p>
            {inviteStatus && <p className="text-[11px] text-amber-700">{inviteStatus}</p>}
          </section>

          <section className="rounded-xl border p-3 space-y-2">
            <div>
              <h3 className="text-sm font-semibold">Social sharing</h3>
              <p className="text-xs text-muted-foreground">Social posts always use the public read-only link.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" disabled={loading || !url} onClick={() => window.open(socialLinks.linkedin, '_blank', 'noopener,noreferrer')} className="gap-1.5">
                <span className="text-xs font-bold" aria-hidden>in</span> LinkedIn
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={loading || !url} onClick={() => window.open(socialLinks.x, '_blank', 'noopener,noreferrer')} className="gap-1.5">
                X
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={loading || !url} onClick={() => window.open(socialLinks.whatsapp, '_blank', 'noopener,noreferrer')} className="gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </Button>
            </div>
          </section>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
