
import { useState } from 'react';
import { User, Edit3, Trash2, Settings, Upload as UploadIcon } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PhotoCard from '@/components/PhotoCard';
import UploadModal from '@/components/UploadModal';
import { usePhotos, PhotoData } from '@/context/PhotoContext';

const Profile = () => {
  const { photos, deletePhoto, updatePhoto } = usePhotos();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoData | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    camera: '',
    pixels: '',
    frameSize: '',
    format: '',
    filter: ''
  });

  // Filter photos by current user (simulation)
  const userPhotos = photos.filter(photo => photo.uploadedBy === 'current_user');
  const totalLikes = userPhotos.reduce((sum, photo) => sum + photo.likes, 0);

  const handleEdit = (photo: PhotoData) => {
    setEditingPhoto(photo);
    setEditForm({
      title: photo.title,
      camera: photo.camera,
      pixels: photo.pixels,
      frameSize: photo.frameSize,
      format: photo.format,
      filter: photo.filter
    });
  };

  const handleUpdate = () => {
    if (editingPhoto) {
      updatePhoto(editingPhoto.id, editForm);
      setEditingPhoto(null);
    }
  };

  const handleDelete = (photoId: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      deletePhoto(photoId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h1 className="font-rough text-3xl mb-2">Your Portfolio</h1>
              <div className="flex space-x-6 text-sm text-gray-600">
                <span>{userPhotos.length} Photos</span>
                <span>{totalLikes} Total Likes</span>
                <span>Member since 2024</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsUploadOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <UploadIcon size={20} />
            <span>Upload New Photo</span>
          </button>
        </div>
        
        {userPhotos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <UploadIcon size={40} className="text-gray-400" />
            </div>
            <h2 className="font-rough text-2xl text-gray-700 mb-2">No photos yet</h2>
            <p className="text-gray-500 mb-6">Upload your first photo to get started!</p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Upload Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPhotos.map(photo => (
              <div key={photo.id} className="relative group">
                <PhotoCard photo={photo} showActions={false} />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-md"
                  >
                    <Edit3 size={16} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-md"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
      
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-rough text-2xl lovable-gradient">Edit Photo</h2>
              <button 
                onClick={() => setEditingPhoto(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Camera"
                value={editForm.camera}
                onChange={(e) => setEditForm(prev => ({ ...prev, camera: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Pixels"
                  value={editForm.pixels}
                  onChange={(e) => setEditForm(prev => ({ ...prev, pixels: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Frame Size"
                  value={editForm.frameSize}
                  onChange={(e) => setEditForm(prev => ({ ...prev, frameSize: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Format"
                  value={editForm.format}
                  onChange={(e) => setEditForm(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Filter"
                  value={editForm.filter}
                  onChange={(e) => setEditForm(prev => ({ ...prev, filter: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
