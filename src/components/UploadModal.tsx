import { useState } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import { useUser } from '@/context/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Camera, Globe, Users } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const [title, setTitle] = useState('');
  const [camera, setCamera] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'global' | 'group'>('global');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { addPhoto } = usePhotos();
  const { currentUser, groups } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to upload photos');
      return;
    }
    
    if (!imageFile || !title.trim() || !camera.trim()) {
      alert('Please fill in all required fields and select an image');
      return;
    }

    if (uploadType === 'group' && !selectedGroup) {
      alert('Please select a group for group upload');
      return;
    }

    setIsUploading(true);

    try {
      // Create object URL for the image
      const imageUrl = URL.createObjectURL(imageFile);
      
      const photoData = {
        url: imageUrl,
        title: title.trim(),
        camera: camera.trim(),
        pixels: '6000x4000', // Default values
        frameSize: '24.2 MP',
        format: 'JPEG',
        filter: 'Natural',
        uploadedBy: currentUser.username,
        isGlobal: uploadType === 'global',
        groupId: uploadType === 'group' ? selectedGroup : undefined
      };

      addPhoto(photoData);
      
      // Reset form
      setTitle('');
      setCamera('');
      setImageFile(null);
      setUploadType('global');
      setSelectedGroup('');
      
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const userGroups = groups.filter(group => 
    group.members.includes(currentUser?.username || '')
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Photo
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="uploadType">Upload Type</Label>
            <Select value={uploadType} onValueChange={(value: 'global' | 'group') => setUploadType(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Global (Public)
                  </div>
                </SelectItem>
                <SelectItem value="group">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Group
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {uploadType === 'group' && (
            <div>
              <Label htmlFor="group">Select Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a group..." />
                </SelectTrigger>
                <SelectContent>
                  {userGroups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="image">Photo *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter photo title..."
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="camera">Camera *</Label>
            <Input
              id="camera"
              type="text"
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              placeholder="e.g., Canon EOS R5"
              className="mt-1"
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
            >
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;