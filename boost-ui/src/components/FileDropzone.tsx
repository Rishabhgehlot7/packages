import * as React from 'react';


/**
 * FileDropzoneProps — Properties for the drag-and-drop file area.
 */
export interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeMB = 10,
  title = 'Click to upload or drag & drop files here',
  subtitle = `Supports files up to ${maxSizeMB}MB`,
  disabled = false,
  className = '',
  style,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fileList, setFileList] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    const updated = multiple ? [...fileList, ...validFiles] : validFiles;
    setFileList(updated);
    onFilesSelected(updated);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    validateAndAddFiles(e.dataTransfer.files);
  };

  const removeFile = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = fileList.filter((_, i) => i !== idx);
    setFileList(updated);
    onFilesSelected(updated);
  };

  return (
    <div
      className={`boost-file-dropzone ${className}`}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        style={{
          border: `2px dashed ${
            isDragOver
              ? 'var(--boost-primary, #2563eb)'
              : 'var(--boost-border, #cbd5e1)'
          }`,
          borderRadius: 'var(--boost-radius, 12px)',
          backgroundColor: isDragOver
            ? 'rgba(37, 99, 235, 0.04)'
            : 'var(--boost-surface, #f8fafc)',
          padding: '36px 20px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          style={{ display: 'none' }}
          onChange={(e) => validateAndAddFiles(e.target.files)}
        />

        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--boost-primary, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <p
          style={{
            fontSize: '15px',
            fontWeight: 600,
            margin: '0 0 6px 0',
            color: 'var(--boost-text, #0f172a)',
          }}
        >
          {title}
        </p>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--boost-text-muted, #64748b)',
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      {error && (
        <div
          style={{
            marginTop: '10px',
            fontSize: '13px',
            color: '#dc2626',
            fontWeight: 500,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {fileList.length > 0 && (
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {fileList.map((file, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--boost-surface, #f1f5f9)',
                border: '1px solid var(--boost-border, #e2e8f0)',
                fontSize: '13px',
              }}
            >
              <span
                style={{
                  fontWeight: 500,
                  color: 'var(--boost-text, #0f172a)',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                type="button"
                onClick={(e) => removeFile(idx, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


FileDropzone.displayName = 'FileDropzone';
