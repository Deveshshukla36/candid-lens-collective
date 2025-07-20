import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  password: string;
  joinedDate: string;
  avatar?: string;
  isAdmin?: boolean;
  isDarkMode?: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdBy: string;
  createdDate: string;
  photos: string[]; // Photo IDs
  isPrivate: boolean;
  isLocked: boolean;
  memberLimit?: number;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  groups: Group[];
  createGroup: (name: string, description: string, isPrivate?: boolean, memberLimit?: number) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  isUsernameAvailable: (username: string) => boolean;
  toggleDarkMode: () => void;
  searchUsers: (query: string) => string[];
  addMemberToGroup: (groupId: string, username: string) => void;
  removeMemberFromGroup: (groupId: string, username: string) => void;
  toggleGroupLock: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  login: (username: string, password: string) => boolean;
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
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      // Apply dark mode if user preference is saved
      if (user.isDarkMode) {
        document.documentElement.classList.add('dark');
      }
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
          photos: [],
          isPrivate: false,
          isLocked: false
        },
        {
          id: 'portrait',
          name: 'Portrait Masters',
          description: 'Human subjects and portrait photography',
          members: [],
          createdBy: 'system',
          createdDate: new Date().toISOString(),
          photos: [],
          isPrivate: false,
          isLocked: false
        },
        {
          id: 'street',
          name: 'Street Photography',
          description: 'Candid moments from urban life',
          members: [],
          createdBy: 'system',
          createdDate: new Date().toISOString(),
          photos: [],
          isPrivate: false,
          isLocked: false
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

  const createGroup = (name: string, description: string, isPrivate = false, memberLimit?: number) => {
    if (!currentUser) return;
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      members: [currentUser.username],
      createdBy: currentUser.username,
      createdDate: new Date().toISOString(),
      photos: [],
      isPrivate,
      isLocked: false,
      memberLimit
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

  const toggleDarkMode = () => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, isDarkMode: !currentUser.isDarkMode };
    setCurrentUser(updatedUser);
    
    if (updatedUser.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const searchUsers = (query: string): string[] => {
    const allUsers = JSON.parse(localStorage.getItem('candid-lens-all-users') || '[]');
    return allUsers.filter((username: string) => 
      username.toLowerCase().includes(query.toLowerCase())
    );
  };

  const addMemberToGroup = (groupId: string, username: string) => {
    if (!currentUser) return;
    
    setGroups(prev => prev.map(group => {
      if (group.id === groupId && 
          (group.createdBy === currentUser.username || currentUser.isAdmin) &&
          !group.members.includes(username) &&
          (!group.memberLimit || group.members.length < group.memberLimit)) {
        return { ...group, members: [...group.members, username] };
      }
      return group;
    }));
  };

  const removeMemberFromGroup = (groupId: string, username: string) => {
    if (!currentUser) return;
    
    setGroups(prev => prev.map(group => {
      if (group.id === groupId && 
          (group.createdBy === currentUser.username || currentUser.isAdmin)) {
        return { ...group, members: group.members.filter(member => member !== username) };
      }
      return group;
    }));
  };

  const toggleGroupLock = (groupId: string) => {
    if (!currentUser) return;
    
    setGroups(prev => prev.map(group => {
      if (group.id === groupId && 
          (group.createdBy === currentUser.username || currentUser.isAdmin)) {
        return { ...group, isLocked: !group.isLocked };
      }
      return group;
    }));
  };

  const deleteGroup = (groupId: string) => {
    if (!currentUser || !currentUser.isAdmin) return;
    setGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const login = (username: string, password: string): boolean => {
    const savedUsers = JSON.parse(localStorage.getItem('candid-lens-all-users') || '[]');
    const userData = savedUsers.find((user: User) => 
      user.username === username && user.password === password
    );
    
    if (userData) {
      setCurrentUser(userData);
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      groups,
      createGroup,
      joinGroup,
      leaveGroup,
      isUsernameAvailable,
      toggleDarkMode,
      searchUsers,
      addMemberToGroup,
      removeMemberFromGroup,
      toggleGroupLock,
      deleteGroup,
      login
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