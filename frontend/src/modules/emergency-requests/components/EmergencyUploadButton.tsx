import React from "react";

type EmergencyUploadButtonProps = {
  onFileSelected?: (photoUrl: string) => void;
  onRemove?: () => void;
  previewUrl?: string;
};

const EmergencyUploadButton = ({ onFileSelected, onRemove, previewUrl }: EmergencyUploadButtonProps) => {
  const inputId = `upload-input-${React.useId()}`;
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const compressImage = (file: File, maxDim = 800, quality = 0.65): Promise<string> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          if (width > maxDim || height > maxDim) {
            const scale = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Prefer webp for smaller size when available
          let dataUrl: string;
          try {
            dataUrl = canvas.toDataURL("image/webp", quality);
            // Some browsers return the same type if not supported, still ok
          } catch {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        } finally {
          URL.revokeObjectURL(url);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };

      img.src = url;
    });

  const readPhoto = async (file: File) => {
    try {
      // Compress/resize to reduce payload size before sending to API
      const compressed = await compressImage(file);
      // enforce server-side schema limit (5_000_000 chars)
      if (compressed.length > 5_000_000) {
        // If still too large, try a lower quality pass
        const smaller = await compressImage(file, 600, 0.5);
        if (smaller.length <= 5_000_000) {
          onFileSelected?.(smaller);
          return;
        }
        // give user a clear client-side error instead of failing silently
        alert("Selected photo is too large after compression. Please choose a smaller image.");
        return;
      }
      onFileSelected?.(compressed);
    } catch {
      // fallback to original dataURL if compression fails
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result === "string") {
          onFileSelected?.(reader.result);
        }
      });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className={`flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-md border bg-white px-4 text-sm font-medium transition hover:border-red-300 hover:ring-2 hover:ring-red-100 ${previewUrl ? "border-green-300 text-green-700" : "border-slate-300 text-slate-500"}`}>
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 16V4m0 0 4 4m-4-4-4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span>{previewUrl ? "Uploaded" : "Upload"}</span>
      </label>

      <input
        id={inputId}
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            readPhoto(file);
          }
        }}
        type="file"
      />

      {previewUrl && (
        <div className="flex justify-center mt-2">
          <button
            className="text-xs font-semibold text-red-500 transition hover:text-red-600 hover:underline hover:underline-offset-2"
            onClick={() => {
              // clear the hidden input so re-selecting the same file will trigger change
              try {
                if (inputRef.current) inputRef.current.value = "";
              } catch {
                /* ignore */
              }
              onRemove?.();
            }}
            type="button"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default EmergencyUploadButton;
