import { useEffect, useRef, useState } from 'react';

interface CameraPermissions {
  granted: boolean;
  denied: boolean;
  error?: string;
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permissions, setPermissions] = useState<CameraPermissions>({
    granted: false,
    denied: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraAccess = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setPermissions({ granted: true, denied: false });
    } catch (error) {
      console.error('Camera access denied:', error);
      setPermissions({ 
        granted: false, 
        denied: true, 
        error: error instanceof Error ? error.message : 'Camera access denied'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setPermissions({ granted: false, denied: false });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    permissions,
    isLoading,
    requestCameraAccess,
    stopCamera,
    stream: streamRef.current
  };
}