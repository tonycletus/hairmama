# Enhanced Photo Upload Features

## Overview

The Hairmama application now includes enhanced photo upload functionality that allows users to upload photos from their device or take photos directly using their camera. This provides a seamless and smooth user experience for capturing hair photos for AI analysis.

## Features

### 📱 Camera Integration
- **Direct Camera Access**: Users can access their device camera directly from the web app
- **Live Preview**: Real-time camera feed with live preview before capture
- **High-Quality Capture**: High-resolution photo capture with optimal settings
- **Front/Back Camera Selection**: Automatic selection of appropriate camera (back camera for hair photos, front camera for profile photos)
- **Retake Functionality**: Users can retake photos if they're not satisfied with the result

### 💾 File Upload
- **Drag & Drop Support**: Intuitive drag and drop interface for file uploads
- **Multiple Formats**: Support for all common image formats (JPEG, PNG, WebP, etc.)
- **File Validation**: Automatic file type and size validation
- **Preview Before Upload**: Image preview before final upload/analysis

### 🎨 UI/UX Enhancements
- **Tabbed Interface**: Clean tabbed interface to switch between upload and camera modes
- **Responsive Design**: Fully responsive design that works on desktop, tablet, and mobile
- **Smooth Animations**: Smooth transitions and animations for better user experience
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Clear loading indicators during photo processing

### 🔧 Technical Features
- **TypeScript Support**: Fully typed components for better development experience
- **Reusable Components**: Modular components that can be used across the application
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Cross-Browser Compatibility**: Works across all modern browsers
- **Mobile Optimized**: Optimized for mobile devices with touch-friendly controls

## Components

### PhotoUpload Component
The main photo upload component used for hair analysis photos.

**Location**: `src/components/ui/photo-upload.tsx`

**Props**:
- `onPhotoSelect: (file: File) => void` - Callback when a photo is selected
- `selectedFile: File | null` - Currently selected file
- `isAnalyzing?: boolean` - Whether analysis is in progress
- `className?: string` - Additional CSS classes

**Features**:
- Optimized for hair photos (uses back camera by default)
- Larger upload area for better UX
- "Analyze Photo" button for hair analysis workflow

### ProfilePhotoUpload Component
A compact version of the photo upload component specifically for profile pictures.

**Location**: `src/components/ui/profile-photo-upload.tsx`

**Props**:
- `onPhotoSelect: (file: File) => void` - Callback when a photo is selected
- `selectedFile: File | null` - Currently selected file
- `isUploading?: boolean` - Whether upload is in progress
- `className?: string` - Additional CSS classes

**Features**:
- Optimized for profile photos (uses front camera by default)
- Compact design for settings pages
- "Save Photo" button for profile update workflow

## Usage Examples

### Basic Usage

```tsx
import PhotoUpload from "@/components/ui/photo-upload";

const MyComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePhotoSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <PhotoUpload
      onPhotoSelect={handlePhotoSelect}
      selectedFile={selectedFile}
      isAnalyzing={isAnalyzing}
    />
  );
};
```

### Profile Photo Upload

```tsx
import ProfilePhotoUpload from "@/components/ui/profile-photo-upload";

const ProfileSettings = () => {
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePhotoSelect = (file: File) => {
    setSelectedProfilePhoto(file);
  };

  return (
    <ProfilePhotoUpload
      onPhotoSelect={handleProfilePhotoSelect}
      selectedFile={selectedProfilePhoto}
      isUploading={isUploading}
    />
  );
};
```

## Implementation Details

### Camera Access
The components use the `navigator.mediaDevices.getUserMedia()` API to access the device camera. The implementation includes:

- **Error Handling**: Graceful handling of camera permission denials
- **Camera Selection**: Automatic selection of appropriate camera based on use case
- **Quality Settings**: Optimized video quality settings for photo capture
- **Stream Management**: Proper cleanup of camera streams to prevent memory leaks

### File Processing
Photos are processed using HTML5 Canvas API for:

- **Quality Optimization**: Automatic quality optimization for web use
- **Format Conversion**: Conversion to JPEG format for consistency
- **Size Management**: Automatic resizing and compression
- **Blob Creation**: Creation of File objects from captured images

### State Management
The components use React hooks for state management:

- **Camera State**: Management of camera stream and capture state
- **File State**: Management of selected files and upload state
- **UI State**: Management of UI states like loading, errors, and active tabs

## Browser Compatibility

The photo upload functionality is compatible with:

- **Chrome**: 60+ (Full support)
- **Firefox**: 55+ (Full support)
- **Safari**: 11+ (Full support)
- **Edge**: 79+ (Full support)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet

## Security Considerations

- **HTTPS Required**: Camera access requires HTTPS in production
- **Permission Handling**: Proper handling of camera permissions
- **File Validation**: Client-side file type and size validation
- **Stream Cleanup**: Proper cleanup of camera streams

## Performance Optimizations

- **Lazy Loading**: Camera access is only initiated when needed
- **Memory Management**: Proper cleanup of camera streams and file objects
- **Image Compression**: Automatic image compression for optimal file sizes
- **Debounced Events**: Debounced event handlers for better performance

## Testing

The photo upload functionality can be tested using the demo page:

1. Navigate to `/photo-upload-demo` in the application
2. Test both hair photo upload and profile photo upload
3. Test camera functionality on mobile devices
4. Test drag and drop functionality on desktop

## Future Enhancements

Potential future enhancements include:

- **Image Editing**: Basic image editing capabilities (crop, rotate, filters)
- **Batch Upload**: Support for uploading multiple photos at once
- **Cloud Storage**: Integration with cloud storage services
- **Advanced Validation**: More sophisticated image validation (resolution, aspect ratio)
- **Progressive Upload**: Progressive image upload with preview
- **Offline Support**: Offline photo capture with sync when online

## Troubleshooting

### Common Issues

1. **Camera Not Accessible**
   - Ensure the site is served over HTTPS
   - Check browser permissions for camera access
   - Try refreshing the page and granting permissions again

2. **Photos Not Uploading**
   - Check file size limits
   - Ensure file format is supported
   - Verify network connectivity

3. **Poor Image Quality**
   - Check camera settings
   - Ensure good lighting conditions
   - Try using a different camera if available

### Debug Information

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'photo-upload:*');
```

## Contributing

When contributing to the photo upload functionality:

1. Follow the existing code style and patterns
2. Add proper TypeScript types
3. Include error handling for edge cases
4. Test on multiple devices and browsers
5. Update documentation for any new features

## License

This photo upload functionality is part of the Hairmama application and follows the same license terms.
