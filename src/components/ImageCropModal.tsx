import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { X } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File;
  onCropComplete: (croppedBlob: Blob) => void;
  type: 'profile' | 'player-card';
}

const MIN_PROFILE_SIZE = 200; // Minimum size for profile pictures (px)
const MIN_CARD_WIDTH = 600; // Minimum width for player cards (px)
const CARD_ASPECT = 9 / 16; // Aspect ratio for player cards

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageFile,
  onCropComplete,
  type
}) => {
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(imageFile);
    return () => reader.abort();
  }, [imageFile]);

  const calculateImageDimensions = (imageWidth: number, imageHeight: number) => {
    const maxWidth = window.innerWidth * 0.8; // 80% of viewport width
    const maxHeight = window.innerHeight * 0.7; // 70% of viewport height
    
    let width = imageWidth;
    let height = imageHeight;
    
    // Scale down if image is larger than max dimensions
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }
    
    return { width, height };
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width: naturalWidth, height: naturalHeight } = e.currentTarget;
    const { width, height } = calculateImageDimensions(naturalWidth, naturalHeight);
    
    // Update image dimensions
    if (imgRef.current) {
      imgRef.current.style.width = `${width}px`;
      imgRef.current.style.height = `${height}px`;
    }

    let initialCrop;
    if (type === 'profile') {
      const size = Math.min(width, height);
      initialCrop = centerCrop(
        makeAspectCrop(
          { unit: 'px', width: size, height: size },
          1,
          width,
          height
        ),
        width,
        height
      );
    } else {
      const cropWidth = Math.min(width, height * CARD_ASPECT);
      const cropHeight = cropWidth / CARD_ASPECT;
      initialCrop = centerCrop(
        makeAspectCrop(
          { unit: 'px', width: cropWidth, height: cropHeight },
          CARD_ASPECT,
          width,
          height
        ),
        width,
        height
      );
    }

    setCrop(initialCrop);
  }

  const handleCrop = async () => {
    if (!imgRef.current || !crop) return;

    try {
      setLoading(true);
      setError(null);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');

      // Calculate crop dimensions
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const pixelCrop = {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY
      };

      // Set canvas dimensions
      if (type === 'profile') {
        // For profile pictures, use a square canvas
        const size = Math.max(MIN_PROFILE_SIZE, pixelCrop.width);
        canvas.width = size;
        canvas.height = size;
      } else {
        // For player cards, maintain 9:16 ratio with minimum width
        const width = Math.max(MIN_CARD_WIDTH, pixelCrop.width);
        const height = width / CARD_ASPECT;
        canvas.width = width;
        canvas.height = height;
      }

      // Apply circular clip for profile pictures
      if (type === 'profile') {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        ctx.clip();
      }

      // Draw and scale image
      ctx.drawImage(
        imgRef.current,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob as Blob),
          'image/jpeg',
          0.9
        );
      });

      await onCropComplete(blob);
      onClose();
    } catch (error) {
      console.error('Crop failed:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    isOpen ? (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-gray-900 rounded-lg shadow-xl w-[90vw] max-w-5xl p-6 m-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {type === 'profile' ? 'Crop Profile Picture' : 'Crop Player Card'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                aspect={type === 'profile' ? 1 : CARD_ASPECT}
                circularCrop={type === 'profile'}
                minWidth={type === 'profile' ? MIN_PROFILE_SIZE : MIN_CARD_WIDTH}
                className="max-w-full max-h-[65vh]"
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                />
              </ReactCrop>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              disabled={loading || !crop?.width || !crop?.height}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    ) : null,
    document.body
  );
};

export default ImageCropModal;