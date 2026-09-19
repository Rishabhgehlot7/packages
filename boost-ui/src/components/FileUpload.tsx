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
  style?: React.CSSProperties;
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
  style,
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
        ...style,
      }}
    >
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', letterSpacing: '-0.01em' }}>
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
          border: `2px dashed ${error ? 'var(--boost-danger, #ef4444)' : isDragOver ? 'var(--boost-primary, #2563eb)' : 'var(--boost-border, #cbd5e1)'}`,
          borderRadius: '10px',
          padding: '28px 20px',
          textAlign: 'center',
          backgroundColor: isDragOver
            ? 'rgba(37, 99, 235, 0.08)'
            : disabled
            ? 'rgba(0, 0, 0, 0.03)'
            : 'var(--boost-surface, #ffffff)',
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
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(100, 116, 139, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--boost-text-muted, #64748b)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--boost-text, #1e293b)' }}>
            Click to upload or drag and drop
          </span>
          <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}>
            Maximum {maxFiles} files, up to {maxSizeMB}MB
          </span>
        </div>
      </div>

      {fileList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
          {fileList.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(100, 116, 139, 0.08)',
                border: '1px solid var(--boost-border, #e2e8f0)',
                borderRadius: '6px',
                fontSize: '13px',
                color: 'var(--boost-text, #334155)',
              }}
            >
              <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                {f.name}
              </span>
              <span style={{ color: 'var(--boost-text-muted, #64748b)', fontSize: '12px' }}>
                {(f.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          ))}
        </div>
      )}

      {error ? (
        <span style={{ fontSize: '12px', color: 'var(--boost-danger, #ef4444)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';

