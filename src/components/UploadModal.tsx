
import { useState } from 'react';
import { X, Upload, Camera, Image, FileType, Filter } from 'lucide-react';
import { usePhotos } from '@/context/PhotoContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const { addPhoto } = usePhotos();
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    camera: '',
    pixels: '',
    frameSize: '',
    format: '',
    filter: '',
    uploadedBy: 'current_user'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.url && formData.title) {
      addPhoto(formData);
      setFormData({
        url: '',
        title: '',
        camera: '',
        pixels: '',
        frameSize: '',
        format: '',
        filter: '',
        uploadedBy: 'current_user'
      });
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-rough text-2xl lovable-gradient">Upload Photo</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo URL *
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Amazing sunset..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Camera size={16} />
              <span>Camera</span>
            </label>
            <input
              type="text"
              name="camera"
              value={formData.camera}
              onChange={handleChange}
              placeholder="Canon EOS R5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Image size={16} />
                <span>Pixels</span>
              </label>
              <input
                type="text"
                name="pixels"
                value={formData.pixels}
                onChange={handleChange}
                placeholder="6000x4000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frame Size
              </label>
              <input
                type="text"
                name="frameSize"
                value={formData.frameSize}
                onChange={handleChange}
                placeholder="24 MP"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileType size={16} />
                <span>Format</span>
              </label>
              <input
                type="text"
                name="format"
                value={formData.format}
                onChange={handleChange}
                placeholder="RAW + JPEG"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Filter size={16} />
                <span>Filter</span>
              </label>
              <input
                type="text"
                name="filter"
                value={formData.filter}
                onChange={handleChange}
                placeholder="Natural Color"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            <Upload size={20} className="inline mr-2" />
            Upload Photo
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
