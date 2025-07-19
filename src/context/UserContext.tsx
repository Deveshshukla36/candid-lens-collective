import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  joinedDate: string;
  avatar?: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdBy: string;
  createdDate: string;
  photos: string[]; // Photo IDs
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  groups: Group[];
  createGroup: (name: string, description: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  isUsernameAvailable: (username: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Load user and groups from localStorage
    const savedUser = localStorage.getItem('candid-lens-user');
    const savedGroups = localStorage.getItem('candid-lens-groups');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    } else {
      // Create default groups
      const defaultGroups: Group[] = [
        {
          id: 'landscape',
          name: 'Landscape Photography',
          description: 'Share your best landscape captures',
          members: [],
          createdBy: 'system',
          createdDate: new Date().toISOString(),
          photos: []
        },
        {
          id: 'portrait',
          name: 'Portrait Masters',
          description: 'Human subjects and portrait photography',
          members: [],
          createdBy: 'system',
          createdDate: new Date().toISOString(),
          photos: []
        },
        {
          id: 'street',
          name: 'Street Photography',
          description: 'Candid moments from urban life',
          members: [],
          createdBy: 'system',
          createdDate: new Date().toISOString(),
          photos: []
        }
      ];
      setGroups(defaultGroups);
      localStorage.setItem('candid-lens-groups', JSON.stringify(defaultGroups));
    }
  }, []);

  useEffect(() => {
    // Save user to localStorage
    if (currentUser) {
      localStorage.setItem('candid-lens-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('candid-lens-user');
    }
  }, [currentUser]);

  useEffect(() => {
    // Save groups to localStorage
    localStorage.setItem('candid-lens-groups', JSON.stringify(groups));
  }, [groups]);

  const isUsernameAvailable = (username: string): boolean => {
    const existingUsers = JSON.parse(localStorage.getItem('candid-lens-users') || '[]');
    return !existingUsers.includes(username.toLowerCase());
  };

  const createGroup = (name: string, description: string) => {
    if (!currentUser) return;
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      members: [currentUser.username],
      createdBy: currentUser.username,
      createdDate: new Date().toISOString(),
      photos: []
    };
    
    setGroups(prev => [...prev, newGroup]);
  };

  const joinGroup = (groupId: string) => {
    if (!currentUser) return;
    
    setGroups(prev => prev.map(group => 
      group.id === groupId && !group.members.includes(currentUser.username)
        ? { ...group, members: [...group.members, currentUser.username] }
        : group
    ));
  };

  const leaveGroup = (groupId: string) => {
    if (!currentUser) return;
    
    setGroups(prev => prev.map(group => 
      group.id === groupId
        ? { ...group, members: group.members.filter(member => member !== currentUser.username) }
        : group
    ));
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      groups,
      createGroup,
      joinGroup,
      leaveGroup,
      isUsernameAvailable
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};