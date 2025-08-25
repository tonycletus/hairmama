import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../integrations/supabase/client';
import { HairPhoto, HairAnalysisResults } from '../types/engagement';
import { useToast } from './use-toast';
import { aiService } from '../lib/ai-service';

export const useHairPhotos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<HairPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Helper function to convert moisture text to percentage
  const calculateMoistureLevel = (moisture: string): number => {
    switch (moisture.toLowerCase()) {
      case 'dry': return 30;
      case 'balanced': return 70;
      case 'oily': return 90;
      default: return 50;
    }
  };

  // Helper function to convert damage text to percentage
  const calculateDamageLevel = (damage: string): number => {
    switch (damage.toLowerCase()) {
      case 'low': return 20;
      case 'moderate': return 50;
      case 'high': return 80;
      default: return 30;
    }
  };

  // Fetch all photos for the user
  const fetchPhotos = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hair_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('date_uploaded', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedPhotos: HairPhoto[] = (data || []).map(photo => ({
        ...photo,
        id: photo.id,
        userId: photo.user_id,
        photoUrl: photo.photo_url,
        thumbnailUrl: photo.thumbnail_url,
        dateUploaded: new Date(photo.date_uploaded),
        analysisResults: photo.analysis_results ? {
          ...photo.analysis_results,
          analysisDate: new Date(photo.analysis_results.analysisDate || photo.date_uploaded)
        } : undefined,
        isPublic: photo.is_public,
        createdAt: new Date(photo.created_at),
        updatedAt: new Date(photo.updated_at)
      }));

      setPhotos(formattedPhotos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photos');
      toast({
        title: "Error",
        description: "Failed to load your hair photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Upload a new photo with optional analysis results
  const uploadPhoto = useCallback(async (
    file: File, 
    title?: string, 
    description?: string, 
    tags?: string[],
    analysisResults?: any
  ) => {
    if (!user) return null;

    try {
      setUploading(true);
      setError(null);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `hair_photos/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hair_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('hair_photos')
        .getPublicUrl(filePath);

      // Analyze the image with AI (if not provided)
      let finalAnalysisResults: HairAnalysisResults | undefined;
      if (analysisResults) {
        // Use provided analysis results
        finalAnalysisResults = analysisResults;
      } else {
        try {
          const analysis = await aiService.analyzeHairPhoto(file);
          finalAnalysisResults = {
            hairType: analysis.details.curlPattern,
            hairCondition: analysis.condition,
            moistureLevel: calculateMoistureLevel(analysis.details.moisture),
            scalpHealth: analysis.details.scalpHealth,
            damageLevel: calculateDamageLevel(analysis.details.damage),
            recommendations: [
              ...analysis.recommendations.immediate,
              ...analysis.recommendations.longTerm
            ],
            confidence: analysis.healthScore,
            analysisDate: new Date()
          };
        } catch (analysisError) {
          // Continue without analysis
        }
      }

      // Insert record into database
      const { data, error: insertError } = await supabase
        .from('hair_photos')
        .insert({
          user_id: user.id,
          photo_url: urlData.publicUrl,
          title: title || `Hair Photo ${new Date().toLocaleDateString()}`,
          description,
          tags,
          analysis_results: finalAnalysisResults,
          date_uploaded: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newPhoto: HairPhoto = {
        ...data,
        id: data.id,
        userId: data.user_id,
        photoUrl: data.photo_url,
        thumbnailUrl: data.thumbnail_url,
        dateUploaded: new Date(data.date_uploaded),
        analysisResults: data.analysis_results ? {
          ...data.analysis_results,
          analysisDate: new Date(data.analysis_results.analysisDate || data.date_uploaded)
        } : undefined,
        isPublic: data.is_public,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setPhotos(prev => [newPhoto, ...prev]);
      
      toast({
        title: "Success",
        description: "Photo uploaded successfully!",
      });

      return newPhoto;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  }, [user, toast]);

  // Delete a photo
  const deletePhoto = useCallback(async (photoId: string) => {
    try {
      setError(null);

      const photo = photos.find(p => p.id === photoId);
      if (!photo) throw new Error('Photo not found');

      // Delete from storage
      const filePath = photo.photoUrl.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('hair_photos')
          .remove([`${user?.id}/${filePath}`]);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('hair_photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) throw deleteError;

      setPhotos(prev => prev.filter(p => p.id !== photoId));
      
      toast({
        title: "Success",
        description: "Photo deleted successfully!",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  }, [photos, user, toast]);

  // Update photo metadata
  const updatePhoto = useCallback(async (
    photoId: string, 
    updates: Partial<Pick<HairPhoto, 'title' | 'description' | 'tags' | 'isPublic'>>
  ) => {
    try {
      setError(null);

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

      const { data, error: updateError } = await supabase
        .from('hair_photos')
        .update(updateData)
        .eq('id', photoId)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedPhoto: HairPhoto = {
        ...data,
        id: data.id,
        userId: data.user_id,
        photoUrl: data.photo_url,
        thumbnailUrl: data.thumbnail_url,
        dateUploaded: new Date(data.date_uploaded),
        analysisResults: data.analysis_results ? {
          ...data.analysis_results,
          analysisDate: new Date(data.analysis_results.analysisDate || data.date_uploaded)
        } : undefined,
        isPublic: data.is_public,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setPhotos(prev => prev.map(p => p.id === photoId ? updatedPhoto : p));
      
      toast({
        title: "Success",
        description: "Photo updated successfully!",
      });

      return updatedPhoto;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update photo');
      toast({
        title: "Error",
        description: "Failed to update photo",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Re-analyze a photo
  const reanalyzePhoto = useCallback(async (photoId: string) => {
    try {
      setError(null);

      const photo = photos.find(p => p.id === photoId);
      if (!photo) throw new Error('Photo not found');

      // Fetch the image from URL
      const response = await fetch(photo.photoUrl);
      const blob = await response.blob();
      const file = new File([blob], 'hair_photo.jpg', { type: 'image/jpeg' });

      // Analyze with AI
      const analysis = await aiService.analyzeHairPhoto(file);
      const analysisResults: HairAnalysisResults = {
        hairType: analysis.details.curlPattern,
        hairCondition: analysis.condition,
        moistureLevel: calculateMoistureLevel(analysis.details.moisture),
        scalpHealth: analysis.details.scalpHealth,
        damageLevel: calculateDamageLevel(analysis.details.damage),
        recommendations: [
          ...analysis.recommendations.immediate,
          ...analysis.recommendations.longTerm
        ],
        confidence: analysis.healthScore,
        analysisDate: new Date()
      };

      // Update database
      const { data, error: updateError } = await supabase
        .from('hair_photos')
        .update({
          analysis_results: analysisResults
        })
        .eq('id', photoId)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedPhoto: HairPhoto = {
        ...data,
        id: data.id,
        userId: data.user_id,
        photoUrl: data.photo_url,
        thumbnailUrl: data.thumbnail_url,
        dateUploaded: new Date(data.date_uploaded),
        analysisResults: data.analysis_results ? {
          ...data.analysis_results,
          analysisDate: new Date(data.analysis_results.analysisDate || data.date_uploaded)
        } : undefined,
        isPublic: data.is_public,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setPhotos(prev => prev.map(p => p.id === photoId ? updatedPhoto : p));
      
      toast({
        title: "Success",
        description: "Photo re-analyzed successfully!",
      });

      return updatedPhoto;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to re-analyze photo');
      toast({
        title: "Error",
        description: "Failed to re-analyze photo",
        variant: "destructive",
      });
      return null;
    }
  }, [photos, toast]);

  // Load photos on mount
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return {
    photos,
    loading,
    uploading,
    error,
    fetchPhotos,
    uploadPhoto,
    deletePhoto,
    updatePhoto,
    reanalyzePhoto
  };
};

