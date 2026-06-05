'use client';

import { useCallback, useState } from 'react';

type UploadZoneProps = {
  onUpload: (file: File) => void;
  disabled?: boolean;
};

export default function UploadZone({ onUpload, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      onUpload(file);
    },
    [onUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
        disabled
          ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
          : isDragging
            ? 'border-navy bg-navy/5'
            : 'border-gray-300 bg-white hover:border-navy/50'
      }`}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface">
        <svg
          className="h-7 w-7 text-navy"
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
      <p className="mb-1 text-lg font-medium text-gray-900">
        Drop your contract PDF here
      </p>
      <p className="mb-6 text-sm text-gray-500">or click to browse</p>
      <label
        className={`inline-flex cursor-pointer items-center rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors ${
          disabled ? 'pointer-events-none opacity-50' : 'hover:bg-navy/90'
        }`}
      >
        Choose PDF
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
    </div>
  );
}
