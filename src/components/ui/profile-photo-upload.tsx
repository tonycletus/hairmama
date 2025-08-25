import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
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
  Smartphone
} from "lucide-react";

interface ProfilePhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  selectedFile: File | null;
  isUploading?: boolean;
  onSave?: (file: File) => void;
  className?: string;
}

const ProfilePhotoUpload = ({ onPhotoSelect, selectedFile, isUploading = false, onSave, className }: ProfilePhotoUploadProps) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
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
      setCameraError(null);
      
      // Try with front camera first (for profile photos)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
      } catch (frontCameraError) {
        // If front camera fails, try with any available camera
        console.log('Front camera failed, trying any available camera:', frontCameraError);
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
      }
      
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera access denied. Please allow camera permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device.');
        } else if (error.name === 'NotReadableError') {
          setCameraError('Camera is already in use by another application.');
        } else {
          setCameraError(`Camera access failed: ${error.message}`);
        }
      } else {
        setCameraError('Unable to access camera. Please check permissions and try again.');
      }
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
          const file = new File([blob], `profile-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
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

  const handleCameraOpen = async () => {
    setIsCameraOpen(true);
    setActiveTab("camera");
    // Start camera when dialog opens
    await startCamera();
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
    stopCamera();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Don't start camera automatically when tab changes
    // Camera will be started when dialog opens
  };

  return (
    <div className={className}>
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

        <TabsContent value="upload" className="space-y-4 mt-4">
          <div 
            className="border-2 border-dashed border-border rounded-lg p-6 text-center transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Click to upload or drag and drop your profile photo
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="profile-photo-upload"
            />
            <label htmlFor="profile-photo-upload">
              <Button asChild size="sm">
                <span>Choose Photo</span>
              </Button>
            </label>
          </div>
        </TabsContent>

        <TabsContent value="camera" className="space-y-4 mt-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="h-4 w-4" />
              <span>Use your device camera to take a profile photo</span>
            </div>
            
            <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCameraOpen} className="flex items-center gap-2" size="sm">
                  <Camera className="h-4 w-4" />
                  Open Camera
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Take Profile Photo
                  </DialogTitle>
                  <DialogDescription>
                    Position yourself clearly in the frame and take a photo
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {cameraError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-700">{cameraError}</span>
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
                            <Button onClick={startCamera} variant="outline">
                              Start Camera
                            </Button>
                          </div>
                        )}
                        
                        {cameraError && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-3">
                              <p className="text-sm text-red-600">{cameraError}</p>
                              <Button onClick={startCamera} variant="outline" size="sm">
                                Retry Camera
                              </Button>
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={capturedImage}
                        alt="Captured profile photo"
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
                      <Button onClick={retakePhoto} variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retake
                      </Button>
                    )}
                    <Button onClick={handleCameraClose} variant="outline" size="sm">
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
        <div className="mt-4">
          <div className="flex items-center justify-between p-3 glass-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-success" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <ImageIcon className="h-3 w-3" />
                {selectedFile.type.split('/')[1].toUpperCase()}
              </Badge>
                             <Button 
                 onClick={() => onSave ? onSave(selectedFile) : onPhotoSelect(selectedFile)} 
                 disabled={isUploading}
                 size="sm"
                 className="flex items-center gap-2"
               >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Save Photo"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
