import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from '../types';

interface AuthContextType {
  user: Member | null;
  login: (email: string) => Promise<void>;
  signup: (memberData: Omit<Member, 'id' | 'memberSince' | 'avatarUrl'>) => Promise<void>;
  updateProfile: (updatedData: Partial<Member>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  
  // Campus Management
  campuses: string[];
  addCampus: (campusName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize campuses from local storage or defaults
  const [campuses, setCampuses] = useState<string[]>(() => {
    const saved = localStorage.getItem('cba_campuses');
    return saved ? JSON.parse(saved) : ['Grace City Main', 'North Campus', 'Online Campus'];
  });

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cba_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const addCampus = (campusName: string) => {
    const updatedCampuses = [...campuses, campusName];
    setCampuses(updatedCampuses);
    localStorage.setItem('cba_campuses', JSON.stringify(updatedCampuses));
  };

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would validate password. 
    // Here we check if a user exists in localStorage "database" or create a mock one if email matches the demo.
    const storedUser = localStorage.getItem('cba_user');
    
    if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if(parsed.email === email) {
            setUser(parsed);
            setIsLoading(false);
            return;
        }
    }

    // Fallback mock login for demo purposes if no custom signup exists
    if (email === 'joshua.d@example.com') {
        const mockUser: Member = {
            id: 'M-1023',
            firstName: 'Joshua',
            lastName: 'Davidson',
            email: 'joshua.d@example.com',
            avatarUrl: 'https://picsum.photos/200/200?random=user',
            memberSince: '2019',
            role: 'Member',
            parish: 'Grace City Main',
            phoneNumber: '(555) 123-4567',
            spiritualInfo: { isBaptized: true, ministryInterests: ['Worship'] }
        };
        setUser(mockUser);
        localStorage.setItem('cba_user', JSON.stringify(mockUser));
    } else {
        // If trying to login with an email that doesn't exist and hasn't signed up
        throw new Error("User not found. Please sign up.");
    }
    setIsLoading(false);
  };

  const signup = async (memberData: Omit<Member, 'id' | 'memberSince' | 'avatarUrl'>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newUser: Member = {
      ...memberData,
      id: `M-${Math.floor(Math.random() * 10000)}`,
      memberSince: new Date().getFullYear().toString(),
      avatarUrl: `https://ui-avatars.com/api/?name=${memberData.firstName}+${memberData.lastName}&background=random`,
    };

    setUser(newUser);
    localStorage.setItem('cba_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const updateProfile = async (updatedData: Partial<Member>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('cba_user', JSON.stringify(updatedUser));
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cba_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading, campuses, addCampus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};