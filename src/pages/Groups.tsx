import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { usePhotos } from '@/context/PhotoContext';
import PhotoCard from '@/components/PhotoCard';
import UploadModal from '@/components/UploadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Calendar, Camera, Users, Plus, ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Groups = () => {
  const { currentUser, groups, createGroup, joinGroup, leaveGroup } = useUser();
  const { photos } = usePhotos();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const selectedGroupData = selectedGroup ? groups.find(g => g.id === selectedGroup) : null;
  const groupPhotos = selectedGroupData ? photos.filter(photo => 
    selectedGroupData.members.includes(photo.uploadedBy || '')
  ) : [];

  const handleCreateGroup = () => {
    if (newGroupName.trim() && newGroupDescription.trim()) {
      createGroup(newGroupName.trim(), newGroupDescription.trim());
      setNewGroupName('');
      setNewGroupDescription('');
      setIsCreateGroupOpen(false);
    }
  };

  const handleJoinLeave = (groupId: string, isMember: boolean) => {
    if (isMember) {
      leaveGroup(groupId);
    } else {
      joinGroup(groupId);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Join the Community</h2>
          <p className="text-gray-600 mb-6">Create a username to access groups and connect with other photographers</p>
          <Link to="/">
            <Button className="bg-black hover:bg-gray-800 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (selectedGroup && selectedGroupData) {
    return (
      <div className="min-h-screen bg-white">
        {/* Group Header */}
        <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <button 
                  onClick={() => setSelectedGroup(null)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Groups</span>
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {selectedGroupData.name}
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">{selectedGroupData.description}</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">{selectedGroupData.members.length}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Camera className="w-4 h-4" />
                    <span className="hidden sm:inline">{groupPhotos.length}</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setIsUploadOpen(true)}
                size="sm"
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Upload className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Group Photos */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {groupPhotos.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-6">No photos shared in this group yet</p>
              <Button 
                onClick={() => setIsUploadOpen(true)}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Share first photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
              {groupPhotos.map(photo => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </main>
        
        <UploadModal 
          isOpen={isUploadOpen} 
          onClose={() => setIsUploadOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-900" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  GROUPS
                </h1>
              </div>
              <div className="text-sm text-gray-600 hidden sm:block">
                Welcome, {currentUser.username}
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateGroupOpen(true)}
              size="sm"
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Groups Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {groups.map(group => {
            const isMember = group.members.includes(currentUser.username);
            const memberPhotos = photos.filter(photo => 
              group.members.includes(photo.uploadedBy || '')
            );
            
            return (
              <div key={group.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {memberPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-0.5 h-full">
                      {memberPhotos.slice(0, 4).map((photo, idx) => (
                        <img 
                          key={idx}
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Camera className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{group.members.length} members</span>
                    <span>{memberPhotos.length} photos</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setSelectedGroup(group.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button 
                      onClick={() => handleJoinLeave(group.id, isMember)}
                      size="sm"
                      className={isMember 
                        ? "bg-gray-600 hover:bg-gray-700 text-white" 
                        : "bg-black hover:bg-gray-800 text-white"
                      }
                    >
                      {isMember ? 'Leave' : 'Join'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Create Group Modal */}
      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Group Name</label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Describe your group"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateGroupOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || !newGroupDescription.trim()}
                className="flex-1 bg-black hover:bg-gray-800"
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Navigation />
    </div>
  );
};

export default Groups;