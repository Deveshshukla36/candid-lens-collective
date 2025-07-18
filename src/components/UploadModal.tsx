import { useState, useRef } from 'react';
import { X, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { usePhotos } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const { addPhoto } = usePhotos();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    camera: '',
    pixels: '',
    frameSize: '',
    format: '',
    filter: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFormData(prev => ({ 
          ...prev, 
          url,
          format: file.type.split('/')[1].toUpperCase(),
          title: file.name.replace(/\.[^/.]+$/, "")
        }));
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url || !formData.title) {
      toast({
        title: "Missing information",
        description: "Please fill in the required fields",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      addPhoto({
        url: formData.url,
        title: formData.title,
        camera: formData.camera || 'Unknown',
        pixels: formData.pixels || 'Unknown',
        frameSize: formData.frameSize || 'Unknown',
        format: formData.format || 'JPEG',
        filter: formData.filter || 'None',
        uploadedBy: 'Current User'
      });

      // Reset form
      setFormData({
        url: '',
        title: '',
        camera: '',
        pixels: '',
        frameSize: '',
        format: '',
        filter: ''
      });
      
      toast({
        title: "Success!",
        description: "Your photo has been uploaded successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500/10 to-white">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-900">
            <Upload className="text-blue-500" size={24} />
            Upload Photo
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-blue-700 hover:bg-blue-100">
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-900">Upload Image File</label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ImageIcon size={16} className="mr-2" />
                Choose Image
              </Button>
            </div>
            {formData.url && (
              <div className="mt-2">
                <img 
                  src={formData.url} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg border border-blue-200"
                />
              </div>
            )}
          </div>
          
          <div className="text-center text-blue-600 text-sm">OR</div>

          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-blue-900">
              Photo URL *
            </label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-blue-900">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Beautiful sunset landscape"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="camera" className="text-sm font-medium text-blue-900">
                Camera
              </label>
              <Input
                id="camera"
                type="text"
                placeholder="Canon EOS R5"
                value={formData.camera}
                onChange={handleChange}
                className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="pixels" className="text-sm font-medium text-blue-900">
                Resolution
              </label>
              <Input
                id="pixels"
                type="text"
                placeholder="4000x3000"
                value={formData.pixels}
                onChange={handleChange}
                className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="frameSize" className="text-sm font-medium text-blue-900">
                Frame Size
              </label>
              <Input
                id="frameSize"
                type="text"
                placeholder="Full Frame"
                value={formData.frameSize}
                onChange={handleChange}
                className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="format" className="text-sm font-medium text-blue-900">
                Format
              </label>
              <Input
                id="format"
                type="text"
                placeholder="RAW, JPEG"
                value={formData.format}
                onChange={handleChange}
                className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="filter" className="text-sm font-medium text-blue-900">
              Filter/Style
            </label>
            <Input
              id="filter"
              type="text"
              placeholder="Vintage, HDR, etc."
              value={formData.filter}
              onChange={handleChange}
              className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:opacity-50"
            >
              <Upload size={16} className="mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;