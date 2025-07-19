import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUser } from '@/context/UserContext';
import { User, Check, X } from 'lucide-react';

interface UserSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSetup = ({ isOpen, onClose }: UserSetupProps) => {
  const { setCurrentUser, isUsernameAvailable } = useUser();
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null);
      return;
    }
    
    setIsChecking(true);
    // Simulate API check delay
    setTimeout(() => {
      const available = isUsernameAvailable(value);
      setIsAvailable(available);
      setIsChecking(false);
    }, 500);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    checkUsername(value);
  };

  const handleSubmit = () => {
    if (username.length >= 3 && isAvailable) {
      // Save username to existing users list
      const existingUsers = JSON.parse(localStorage.getItem('candid-lens-users') || '[]');
      existingUsers.push(username.toLowerCase());
      localStorage.setItem('candid-lens-users', JSON.stringify(existingUsers));
      
      setCurrentUser({
        username,
        joinedDate: new Date().toISOString()
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Create Your Username</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose a unique username to join the Candid Lens community and access group features.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <Input
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Enter username"
                className="pr-10"
                minLength={3}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isChecking ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : isAvailable === true ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : isAvailable === false ? (
                  <X className="w-4 h-4 text-red-600" />
                ) : null}
              </div>
            </div>
            
            {username.length >= 3 && isAvailable === false && (
              <p className="text-sm text-red-600">Username not available</p>
            )}
            {username.length >= 3 && isAvailable === true && (
              <p className="text-sm text-green-600">Username available!</p>
            )}
            {username.length > 0 && username.length < 3 && (
              <p className="text-sm text-gray-500">Username must be at least 3 characters</p>
            )}
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!username || username.length < 3 || !isAvailable || isChecking}
            className="w-full bg-black hover:bg-gray-800"
          >
            Create Username
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSetup;