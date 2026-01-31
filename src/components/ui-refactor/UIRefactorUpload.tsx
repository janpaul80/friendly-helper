import { useCallback, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';

interface UIRefactorUploadProps {
  uploadedImage: string | null;
  uploadedFileName: string;
  onImageUpload: (imageDataUrl: string, fileName: string) => void;
  onRemoveImage: () => void;
  isProcessing: boolean;
}

export function UIRefactorUpload({
  uploadedImage,
  uploadedFileName,
  onImageUpload,
  onRemoveImage,
  isProcessing,
}: UIRefactorUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageUpload(result, file.name);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-orange-500/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <FileImage size={16} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Screenshot Upload</h3>
            <p className="text-xs text-gray-500">Upload a UI screenshot to analyze and refactor</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {uploadedImage ? (
          <div className="relative group">
            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden bg-black/50 border border-orange-500/20">
              <img
                src={uploadedImage}
                alt="Uploaded screenshot"
                className="w-full h-auto max-h-[500px] object-contain"
              />
              
              {/* Overlay on hover */}
              {!isProcessing && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={handleClick}
                    className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 rounded-lg text-sm font-medium text-orange-400 transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    onClick={onRemoveImage}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-sm font-medium text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* File info */}
            <div className="mt-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <ImageIcon size={14} className="text-orange-500/60" />
                <span className="text-xs text-gray-400 font-medium truncate max-w-[200px]">
                  {uploadedFileName}
                </span>
              </div>
              {!isProcessing && (
                <button
                  onClick={onRemoveImage}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X size={12} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative min-h-[400px] rounded-xl border-2 border-dashed transition-all cursor-pointer
              flex flex-col items-center justify-center gap-4 p-8
              ${isDragging 
                ? 'border-orange-500 bg-orange-500/10' 
                : 'border-orange-500/20 bg-black/30 hover:border-orange-500/40 hover:bg-orange-500/5'
              }
            `}
          >
            {/* Upload Icon */}
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-all
              ${isDragging ? 'bg-orange-500/20' : 'bg-orange-500/10'}
            `}>
              <Upload size={28} className={`${isDragging ? 'text-orange-400' : 'text-orange-500/60'}`} />
            </div>

            {/* Text */}
            <div className="text-center">
              <p className="text-sm font-bold text-white mb-1">
                {isDragging ? 'Drop your screenshot here' : 'Drop a screenshot or click to upload'}
              </p>
              <p className="text-xs text-gray-500">
                Supports PNG, JPG, WebP up to 10MB
              </p>
            </div>

            {/* Supported formats */}
            <div className="flex items-center gap-2 mt-2">
              {['PNG', 'JPG', 'WebP'].map((format) => (
                <span
                  key={format}
                  className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-gray-500 bg-gray-500/10 rounded"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
