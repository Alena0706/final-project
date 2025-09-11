import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image, Video, File } from 'lucide-react';

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  type: 'image' | 'video' | 'document';
  label: string;
  className?: string;
}

export default function FileUpload({
  accept,
  onFileSelect,
  selectedFile,
  type,
  label,
  className = '',
}: FileUploadProps): React.JSX.Element {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFileSelect(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onFileSelect],
  );

  const getIcon = () => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6 text-primary" />;
      case 'video':
        return <Video className="w-6 h-6 text-primary" />;
      default:
        return <File className="w-6 h-6 text-primary" />;
    }
  };

  const getFileTypeText = () => {
    switch (type) {
      case 'image':
        return 'фото';
      case 'video':
        return 'видео';
      default:
        return 'файл';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-foreground block">{label}</label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200 h-24 flex items-center justify-center
          ${
            isDragOver
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }
          ${selectedFile ? 'border-primary bg-primary/5' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-1 w-full">
          {selectedFile ? (
            <>
              <div className="flex items-center space-x-2 w-full justify-center">
                {getIcon()}
                <span className="text-sm font-medium text-foreground">Загружено</span>
                <button
                  onClick={handleRemove}
                  className="p-1 hover:bg-destructive/10 rounded-full transition-colors flex-shrink-0"
                  type="button"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
              </div>
              <div className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-1">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {isDragOver ? 'Отпустите файл здесь' : `Выберите ${getFileTypeText()}`}
                </p>
                <p className="text-xs text-muted-foreground">или перетащите файл</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
