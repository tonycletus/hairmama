import React, { useState } from 'react';
import { HairPhoto } from '../../types/engagement';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

import { Separator } from '../ui/separator';
import { 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw, 
  TrendingUp,
  Droplets,
  Heart,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useHairPhotos } from '../../hooks/useHairPhotos';
import PhotoUpload from '../ui/photo-upload';

interface ProgressGalleryProps {
  className?: string;
}

export const ProgressGallery: React.FC<ProgressGalleryProps> = ({ className }) => {
  const { photos, loading, uploading, uploadPhoto, deletePhoto, updatePhoto, reanalyzePhoto } = useHairPhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<HairPhoto | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<HairPhoto | null>(null);

  const handlePhotoUpload = async (file: File) => {
    const result = await uploadPhoto(file);
    if (result) {
      setIsUploadDialogOpen(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await deletePhoto(photoId);
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(null);
      }
    }
  };

  const getAnalysisColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getAnalysisIcon = (type: string, score?: number) => {
    if (!score) return <AlertTriangle className="w-4 h-4" />;
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <TrendingUp className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Progress Gallery</h2>
          <Button onClick={() => setIsUploadDialogOpen(true)} disabled>
            Upload Photo
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Progress Gallery</h2>
          <p className="text-muted-foreground">
            Track your hair journey with photos and AI analysis
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Progress Photo</DialogTitle>
          </DialogHeader>
          <PhotoUpload 
            onPhotoSelect={handlePhotoUpload}
            selectedFile={null}
            isAnalyzing={uploading}
            onAnalyze={handlePhotoUpload}
          />
        </DialogContent>
      </Dialog>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your hair progress by uploading your first photo
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              Upload Your First Photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Photo */}
              <div className="relative group">
                <img
                  src={photo.photoUrl}
                  alt={photo.title || 'Hair progress photo'}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(photo);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPhoto(photo);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm truncate flex-1">
                    {photo.title}
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => reanalyzePhoto(photo.id)}
                    className="ml-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {photo.dateUploaded.toLocaleDateString()}
                </div>

                {/* Analysis Results */}
                {photo.analysisResults && (
                  <div className="space-y-2">
                    <Separator />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {photo.analysisResults.hairType && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Type:</span>
                          <Badge variant="outline" className="text-xs">
                            {photo.analysisResults.hairType}
                          </Badge>
                        </div>
                      )}
                      
                      {photo.analysisResults.moistureLevel && (
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          <span className="font-medium">Moisture:</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getAnalysisColor(photo.analysisResults.moistureLevel)}`}
                          >
                            {photo.analysisResults.moistureLevel}%
                          </Badge>
                        </div>
                      )}

                      {photo.analysisResults.damageLevel && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="font-medium">Damage:</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getAnalysisColor(100 - photo.analysisResults.damageLevel)}`}
                          >
                            {photo.analysisResults.damageLevel}%
                          </Badge>
                        </div>
                      )}

                      {photo.analysisResults.scalpHealth && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span className="font-medium">Scalp:</span>
                          <Badge variant="outline" className="text-xs">
                            {photo.analysisResults.scalpHealth}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {photo.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {photo.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{photo.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPhoto.title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Photo */}
                <div>
                  <img
                    src={selectedPhoto.photoUrl}
                    alt={selectedPhoto.title || 'Hair progress photo'}
                    className="w-full rounded-lg"
                  />
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Uploaded: {selectedPhoto.dateUploaded.toLocaleDateString()}</p>
                    {selectedPhoto.description && (
                      <p className="mt-2">{selectedPhoto.description}</p>
                    )}
                  </div>
                </div>

                {/* Analysis */}
                <div className="h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    <h3 className="font-semibold">AI Analysis Results</h3>
                    
                    {selectedPhoto.analysisResults ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {selectedPhoto.analysisResults.hairType && (
                            <Card>
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">Hair Type</span>
                                </div>
                                <Badge variant="outline">{selectedPhoto.analysisResults.hairType}</Badge>
                              </CardContent>
                            </Card>
                          )}

                          {selectedPhoto.analysisResults.hairCondition && (
                            <Card>
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">Condition</span>
                                </div>
                                <Badge variant="outline">{selectedPhoto.analysisResults.hairCondition}</Badge>
                              </CardContent>
                            </Card>
                          )}

                          {selectedPhoto.analysisResults.moistureLevel && (
                            <Card>
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Droplets className="w-4 h-4" />
                                  <span className="font-medium text-sm">Moisture Level</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: `${selectedPhoto.analysisResults.moistureLevel}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">
                                    {selectedPhoto.analysisResults.moistureLevel}%
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {selectedPhoto.analysisResults.damageLevel && (
                            <Card>
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span className="font-medium text-sm">Damage Level</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-red-500 h-2 rounded-full"
                                      style={{ width: `${selectedPhoto.analysisResults.damageLevel}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">
                                    {selectedPhoto.analysisResults.damageLevel}%
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>

                        {selectedPhoto.analysisResults.recommendations && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {selectedPhoto.analysisResults.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        <div className="text-xs text-muted-foreground">
                          Analyzed on: {selectedPhoto.analysisResults.analysisDate.toLocaleDateString()}
                          {selectedPhoto.analysisResults.confidence && (
                            <span className="ml-4">
                              Confidence: {selectedPhoto.analysisResults.confidence}%
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-4 text-center">
                          <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-3">
                            No analysis available for this photo
                          </p>
                          <Button 
                            size="sm" 
                            onClick={() => reanalyzePhoto(selectedPhoto.id)}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Analyze Now
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

