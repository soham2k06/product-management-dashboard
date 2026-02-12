"use client";

import React from "react";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadService } from "@/services/upload.service";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  label?: string;
  multiple?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  label = "Upload image",
  multiple = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      setError(null);

      const filesToUpload = Array.from(files);
      const totalBytes = filesToUpload.reduce(
        (acc, file) => acc + file.size,
        0,
      );

      let uploadedBytes = 0;
      const uploadedUrls: string[] = [];

      try {
        setIsUploading(true);
        setUploadProgress(0);

        for (const file of filesToUpload) {
          await uploadService(file, (fileProgress) => {
            // fileProgress is percentage of this file
            const fileUploadedBytes = (fileProgress / 100) * file.size;

            const currentTotal = uploadedBytes + fileUploadedBytes;

            const overallPercent = Math.round(
              (currentTotal / totalBytes) * 100,
            );

            setUploadProgress(overallPercent);
          }).then((response) => {
            uploadedBytes += file.size;
            uploadedUrls.push(response.secure_url);
          });
        }

        if (multiple) {
          const currentImages = Array.isArray(value)
            ? value
            : value
              ? [value]
              : [];

          onChange([...currentImages, ...uploadedUrls]);
        } else {
          onChange(uploadedUrls[0] ?? "");
        }

        toast.success("Images uploaded successfully");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        toast.error(message);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [multiple, value, onChange],
  );

  const handleRemoveImage = (index: number) => {
    if (multiple) {
      onChange(images.filter((_, i) => i !== index));
    } else {
      onChange("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload area */}
      {(multiple || images.length === 0) && (
        <div
          className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 text-center transition-colors hover:border-primary hover:bg-muted"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                {isUploading && <Loader2 className="animate-spin size-4" />}
                Choose Files
              </Button>
            </>
          )}
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div
          className={`grid gap-2 ${multiple ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Upload ${index}`}
                fill
                className="object-cover"
                sizes="200px"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                disabled={disabled}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          ))}

          {/* Add more button for multiple */}
          {multiple && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-muted"
              disabled={disabled || isUploading}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
