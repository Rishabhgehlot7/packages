import * as React from 'react';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  maxFiles = 5,
  maxSizeMB = 10,
  onFilesSelected,
  error,
  helperText,
  disabled = false,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [fileList, setFileList] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFileList(droppedFiles);
      onFilesSelected(droppedFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFileList(selectedFiles);
      onFilesSelected(selectedFiles);
    }
  };

  return (
    <div
      className={`boost-fileupload-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontFamily: 'inherit',
        width: '100%',
      }}
    >
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        style={{
          border: `2px dashed ${error ? '#ef4444' : isDragOver ? '#2563eb' : '#cbd5e1'}`,
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: isDragOver ? '#eff6ff' : disabled ? '#f8fafc' : '#ffffff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
            Click to upload or drag and drop
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Maximum {maxFiles} files, up to {maxSizeMB}MB
          </span>
        </div>
      </div>

      {fileList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
          {fileList.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                background: '#f1f5f9',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#334155',
              }}
            >
              <span>{f.name}</span>
              <span style={{ color: '#64748b' }}>{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
          ))}
        </div>
      )}

      {error ? (
        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};


FileUpload.displayName = 'FileUpload';
