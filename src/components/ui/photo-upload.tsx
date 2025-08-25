import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  X, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Video,
  Smartphone
} from "lucide-react";

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  selectedFile: File | null;
  isAnalyzing?: boolean;
  onAnalyze?: (file: File) => void;
  className?: string;
}

const PhotoUpload = ({ onPhotoSelect, selectedFile, isAnalyzing = false, onAnalyze, className }: PhotoUploadProps) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoSelect(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onPhotoSelect(imageFile);
    }
  }, [onPhotoSelect]);

  const startCamera = async () => {
    try {
      setIsStartingCamera(true);
      setCameraError(null);
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser. Please use a modern browser or try file upload instead.');
      }
      
      // Check for secure context (HTTPS) on mobile devices
      if (!window.isSecureContext && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        throw new Error('Camera access requires HTTPS on mobile devices. Please use file upload instead or access the app via HTTPS.');
      }
      
      // Try different camera configurations
      const constraints = [
        { video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } },
        { video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } },
        { video: { width: { ideal: 1280 }, height: { ideal: 720 } } },
        { video: true }
      ];

      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      for (const constraint of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          break;
        } catch (error) {
          lastError = error as Error;
          console.log(`Camera constraint failed:`, constraint, error);
        }
      }

      if (!stream) {
        throw lastError || new Error('No camera available');
      }
      
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      let errorMessage = 'Unable to access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Camera permission denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on your device.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera is in use by another application. Please close other camera apps and try again.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage += 'Camera does not support the required settings.';
        } else if (error.name === 'AbortError') {
          errorMessage += 'Camera access was interrupted.';
        } else {
          errorMessage += error.message || 'Please check permissions and try again.';
        }
      } else {
        errorMessage += 'Please check permissions and try again.';
      }
      
      setCameraError(errorMessage);
    } finally {
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCapturedImage(null);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `hair-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onPhotoSelect(file);
          setCapturedImage(canvas.toDataURL('image/jpeg'));
        }
        setIsCapturing(false);
      }, 'image/jpeg', 0.9);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const handleCameraOpen = () => {
    setIsCameraOpen(true);
    setActiveTab("camera");
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
    stopCamera();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "camera" && !cameraStream) {
      startCamera();
    }
  };

  return (
    <Card className={`glass-card border-border/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Upload Hair Photo
        </CardTitle>
        <CardDescription>
          Upload a clear photo of your hair for comprehensive AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Camera
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Click to upload or drag and drop your hair photo
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button asChild>
                  <span>Choose Photo</span>
                </Button>
              </label>
            </div>
          </TabsContent>

          <TabsContent value="camera" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Smartphone className="h-4 w-4" />
                <span>Use your device camera to take a photo</span>
              </div>
              
              <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleCameraOpen} className="flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Camera className="h-4 w-4" />
                    <span className="hidden sm:inline">Open Camera</span>
                    <span className="sm:hidden">Camera</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Take Hair Photo
                    </DialogTitle>
                    <DialogDescription>
                      Position your hair clearly in the frame and take a photo
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {cameraError && (
                      <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-700">Camera Error</span>
                        </div>
                        <p className="text-sm text-red-700">{cameraError}</p>
                        <div className="flex gap-2">
                          <Button 
                            onClick={startCamera} 
                            size="sm" 
                            variant="outline"
                            disabled={isStartingCamera}
                          >
                            {isStartingCamera ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Starting...
                              </>
                            ) : (
                              <>
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Retry
                              </>
                            )}
                          </Button>
                          <Button onClick={handleCameraClose} size="sm" variant="outline">
                            Use File Upload
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {!capturedImage ? (
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 object-cover rounded-lg bg-black"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {cameraStream && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                            <Button
                              onClick={capturePhoto}
                              disabled={isCapturing}
                              size="lg"
                              className="rounded-full w-16 h-16 bg-white border-4 border-primary hover:bg-gray-50"
                            >
                              {isCapturing ? (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary" />
                              )}
                            </Button>
                          </div>
                        )}
                        
                        {!cameraStream && !cameraError && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button 
                              onClick={startCamera} 
                              variant="outline" 
                              className="flex items-center gap-2"
                              disabled={isStartingCamera}
                            >
                              {isStartingCamera ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Starting Camera...
                                </>
                              ) : (
                                <>
                                  <Camera className="h-4 w-4" />
                                  Start Camera
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={capturedImage}
                          alt="Captured hair photo"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            onClick={retakePhoto}
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleCameraClose}
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-center gap-2">
                      {capturedImage && (
                        <Button onClick={retakePhoto} variant="outline">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Retake
                        </Button>
                      )}
                      <Button onClick={handleCameraClose} variant="outline">
                        Close
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 glass-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div className="flex flex-col">
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {selectedFile.type.split('/')[1].toUpperCase()}
                </Badge>
                <Button 
                  onClick={() => onAnalyze ? onAnalyze(selectedFile) : onPhotoSelect(selectedFile)} 
                  disabled={isAnalyzing}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Analyzing...</span>
                      <span className="sm:hidden">Analyzing</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Analyze Photo</span>
                      <span className="sm:hidden">Analyze</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;
