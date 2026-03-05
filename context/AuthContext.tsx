import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from '../types';
import { auth, db } from '../src/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: Member | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (memberData: Omit<Member, 'id' | 'memberSince' | 'avatarUrl'> & { password?: string }) => Promise<void>;
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

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Fetch the extended user profile from Firestore
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUser({ id: firebaseUser.uid, ...docSnap.data() } as Member);
          } else {
            console.warn("No user profile found in Firestore for:", firebaseUser.uid);
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addCampus = (campusName: string) => {
    const updatedCampuses = [...campuses, campusName];
    setCampuses(updatedCampuses);
    localStorage.setItem('cba_campuses', JSON.stringify(updatedCampuses));
  };

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (!password) {
          throw new Error("Password is required for login.");
      }
      await signInWithEmailAndPassword(auth, email, password);
      // State is handled by onAuthStateChanged
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (memberData: Omit<Member, 'id' | 'memberSince' | 'avatarUrl'> & { password?: string }) => {
    setIsLoading(true);
    try {
      if (!memberData.password) {
         throw new Error("Password is required for signup");
      }
      
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, memberData.email, memberData.password);
      const firebaseUser = userCredential.user;

      // 2. Prepare the extended member profile
      const { password, ...restOfUserData } = memberData;
      
      const newUserProfile = {
        ...restOfUserData,
        memberSince: new Date().getFullYear().toString(),
        avatarUrl: `https://ui-avatars.com/api/?name=${memberData.firstName}+${memberData.lastName}&background=random`,
        privacySettings: {
          showInDirectory: true,
          showPhone: true,
          showEmail: true
        }
      };

      // 3. Save the profile to Firestore using the Auth UID as the document ID
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userRef, newUserProfile);
      
      // State updates automatically via onAuthStateChanged, but we'll set it here to be immediate
      setUser({ id: firebaseUser.uid, ...newUserProfile } as Member);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const updateProfile = async (updatedData: Partial<Member>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updatedData);
      
      // Optimistically update local state
      setUser({ ...user, ...updatedData });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
       console.error("Error signing out:", error);
    }
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