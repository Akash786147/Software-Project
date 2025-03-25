import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Profile } from '@/lib/auth';

type AuthContextType = {
  user: Profile | null;
  isLoading: boolean;
  setUserRole: (role: 'student' | 'faculty') => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUserRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock user data
const mockStudentUser: Profile = {
  id: 'student-123',
  first_name: 'Student',
  last_name: 'User',
  email: 'student@example.com',
  role: 'student',
  batch: '2023-2027',
  course: 'B.Tech',
};

const mockFacultyUser: Profile = {
  id: 'faculty-123',
  first_name: 'Faculty',
  last_name: 'User',
  email: 'faculty@example.com',
  role: 'faculty',
  department: 'Computer Science',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Default to student user for now
  const [user, setUser] = useState<Profile | null>(mockStudentUser);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set mock user based on path
    // This is just to handle initial load
    if (location.pathname !== '/auth') {
      // Keep current user role if already set
      if (!user) {
        setUser(mockStudentUser);
      }
    }
    setIsLoading(false);
  }, [location.pathname, user]);

  // Function to switch between student and faculty
  const setUserRole = (role: 'student' | 'faculty') => {
    setUser(role === 'student' ? mockStudentUser : mockFacultyUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
