'use client';

import { useCallback, useRef, useState } from 'react';
import { ButtonPrimary } from '@/components/ui/Button';

type UploadZoneProps = {
  onUpload: (file: File) => void;
  disabled?: boolean;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone({ onUpload, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      setSelectedFile(file);
      onUpload(file);
    },
    [onUpload],
  );

  const openFilePicker = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile],
  );

  return (
    <div className="mx-auto max-w-xl">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFilePicker();
          }
        }}
        onClick={openFilePicker}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`card border-dashed p-12 text-center ${
          disabled
            ? 'cursor-not-allowed opacity-60'
            : isDragging
              ? 'cursor-pointer border-brand bg-[#EAF3DE]/30'
              : 'cursor-pointer border-border hover:border-brand/50'
        }`}
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand">
          <svg
            className="h-7 w-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <p className="mb-1 text-[18px] font-medium text-gray-900">
          Drop your contract PDF here
        </p>
        <p className="mb-6 text-[16px] text-muted">or click to browse</p>
        <ButtonPrimary
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            openFilePicker();
          }}
          className="cursor-pointer px-6 py-3 text-[16px]"
        >
          Choose PDF
        </ButtonPrimary>
      </div>

      {selectedFile && (
        <div className="card mt-4 flex items-center gap-4 px-5 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF3DE] text-[#3B6D11]">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-medium text-gray-900">
              {selectedFile.name}
            </p>
            <p className="text-[15px] text-muted">
              {formatFileSize(selectedFile.size)}
              {disabled ? ' · Analyzing…' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
