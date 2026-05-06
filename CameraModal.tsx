import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Camera as CameraIcon } from 'lucide-react';

export default function CameraModal({ onCapture, onClose }: { onCapture: (dataUrl: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check your permissions.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#141416] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <CameraIcon className="w-5 h-5 text-rose-400" />
            Camera
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {error ? (
            <p className="text-rose-400 text-sm p-6 text-center">{error}</p>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-6 flex justify-center">
          <button
            onClick={handleCapture}
            disabled={!!error}
            className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-400 disabled:opacity-50 disabled:hover:bg-rose-500 flex items-center justify-center border-4 border-[#141416] outline outline-2 outline-rose-500 shadow-lg transition-transform active:scale-95"
          >
            <CameraIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
