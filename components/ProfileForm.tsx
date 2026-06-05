'use client';

import { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import {
  updateProfileName,
  updateProfileEmail,
  updateProfilePassword,
} from '@/app/profile/actions';
import { getPasswordStrength } from '@/lib/profile';
import { ButtonPrimary } from '@/components/ui/Button';
import type { UserProfile } from '@/lib/profile';

type ProfileFormProps = {
  profile: UserProfile;
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 sm:p-8">
      <h2 className="text-[18px] font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-1 text-[15px] text-muted">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-gray-900 outline-none focus:border-brand';

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [emailMsg, setEmailMsg] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [avatarErr, setAvatarErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [pendingName, startName] = useTransition();
  const [pendingEmail, startEmail] = useTransition();
  const [pendingPass, startPass] = useTransition();
  const [pendingAvatar, startAvatar] = useTransition();

  const strength = getPasswordStrength(password);
  const initials = (profile.fullName || profile.email)
    .slice(0, 2)
    .toUpperCase();

  async function handleAvatar(file: File) {
    setAvatarErr(null);
    startAvatar(async () => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setAvatarErr(data.error || 'Upload failed');
        return;
      }
      setAvatarUrl(data.avatarUrl);
    });
  }

  return (
    <div className="space-y-6">
      <Section title="Profile photo" description="JPG, PNG, WebP or GIF. Max 2MB.">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-canvas">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#EAF3DE] text-[22px] font-semibold text-brand">
                {initials}
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleAvatar(f);
              }}
            />
            <ButtonPrimary
              type="button"
              disabled={pendingAvatar}
              className="px-5 py-2.5"
              onClick={() => fileRef.current?.click()}
            >
              {pendingAvatar ? 'Uploading…' : 'Change photo'}
            </ButtonPrimary>
            {avatarErr && (
              <p className="mt-2 text-[15px] text-[#A32D2D]">{avatarErr}</p>
            )}
          </div>
        </div>
      </Section>

      <Section title="Display name">
        <form
          action={(fd) => {
            setNameMsg(null);
            setNameErr(null);
            startName(async () => {
              const r = await updateProfileName(fd);
              if (r.error) setNameErr(r.error);
              else if (r.message) setNameMsg(r.message);
            });
          }}
          className="space-y-4"
        >
          <input
            name="fullName"
            defaultValue={profile.fullName}
            required
            className={inputClass}
            placeholder="Your name"
          />
          {nameErr && <p className="text-[15px] text-[#A32D2D]">{nameErr}</p>}
          {nameMsg && <p className="text-[15px] text-[#3B6D11]">{nameMsg}</p>}
          <ButtonPrimary type="submit" disabled={pendingName}>
            {pendingName ? 'Saving…' : 'Save name'}
          </ButtonPrimary>
        </form>
      </Section>

      <Section
        title="Email"
        description="Changing email requires confirmation via inbox."
      >
        <form
          action={(fd) => {
            setEmailMsg(null);
            setEmailErr(null);
            startEmail(async () => {
              const r = await updateProfileEmail(fd);
              if (r.error) setEmailErr(r.error);
              else if (r.message) setEmailMsg(r.message);
            });
          }}
          className="space-y-4"
        >
          <input
            name="email"
            type="email"
            defaultValue={profile.email}
            required
            className={inputClass}
          />
          {emailErr && <p className="text-[15px] text-[#A32D2D]">{emailErr}</p>}
          {emailMsg && <p className="text-[15px] text-[#3B6D11]">{emailMsg}</p>}
          <ButtonPrimary type="submit" disabled={pendingEmail}>
            {pendingEmail ? 'Saving…' : 'Update email'}
          </ButtonPrimary>
        </form>
      </Section>

      <Section title="Password">
        <form
          action={(fd) => {
            setPassMsg(null);
            setPassErr(null);
            startPass(async () => {
              const r = await updateProfilePassword(fd);
              if (r.error) setPassErr(r.error);
              else if (r.message) {
                setPassMsg(r.message);
                setPassword('');
              }
            });
          }}
          className="space-y-4"
        >
          <div>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              className={inputClass}
              placeholder="New password"
            />
            {password && (
              <div className="mt-3">
                <div className="mb-1.5 flex justify-between text-[14px]">
                  <span className="text-muted">Password strength</span>
                  <span className="font-medium text-gray-900">{strength.label}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${strength.score}%`,
                      backgroundColor: strength.barColor,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <input
            name="confirmPassword"
            type="password"
            minLength={8}
            required
            className={inputClass}
            placeholder="Confirm new password"
          />
          {passErr && <p className="text-[15px] text-[#A32D2D]">{passErr}</p>}
          {passMsg && <p className="text-[15px] text-[#3B6D11]">{passMsg}</p>}
          <ButtonPrimary type="submit" disabled={pendingPass}>
            {pendingPass ? 'Saving…' : 'Update password'}
          </ButtonPrimary>
        </form>
      </Section>
    </div>
  );
}
