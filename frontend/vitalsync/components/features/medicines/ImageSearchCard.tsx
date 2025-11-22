'use client';

import { useEffect, useState, useRef } from 'react';
import { useAdvancedMedicineStore } from '@/store/useAdvancedMedicineStore';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdvancedImageSearch } from '@/hooks/useAdvancedMedicineSearch';

export const ImageSearchCard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const setPreviewImage = useAdvancedMedicineStore(
    (state) => state.setPreviewImage
  );
  const previewImage = useAdvancedMedicineStore((state) => state.previewImage);
  const { mutate, isPending } = useAdvancedImageSearch();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua) || coarse);
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
      mutate({ imageData: base64 });
    };
    reader.readAsDataURL(file);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <UploadCloud className="size-8 text-primary" />
        <h3 className="text-2xl font-bold">Escanear Imagen</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Sube la foto de una caja de medicina o una receta para buscar.
      </p>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 px-6 py-10 text-center ${
          isDragging ? 'bg-primary/10' : 'bg-primary/5'
        }`}
      >
        <span className="text-5xl text-primary/60">📷</span>
        <p className="text-base font-medium text-foreground">
          Arrastra y suelta una imagen aquí
        </p>
        <p className="text-sm text-muted-foreground">o</p>
        <Button
          type="button"
          variant="outline"
          className="border-primary/40 text-primary"
          onClick={() => inputRef.current?.click()}
        >
          {isMobile ? 'Tomar o subir foto' : 'Seleccionar imagen'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture={isMobile ? 'environment' : undefined}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        {previewImage && (
          <div className="mt-4 w-full overflow-hidden rounded-xl border border-primary/30">
            <img
              src={previewImage}
              alt="Receta subida"
              className="h-48 w-full object-cover"
            />
          </div>
        )}
        {isPending && (
          <p className="text-sm text-muted-foreground">Analizando imagen...</p>
        )}
      </label>
    </div>
  );
};
