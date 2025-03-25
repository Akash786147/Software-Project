
export type UserRole = 'student' | 'faculty';

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  batch?: string;
  department?: string;
  course?: string;
  profile_image?: string;
};

export type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  batch?: string;
  department?: string;
  course?: string;
};

// Mock function - not actually using Supabase anymore
export const signUpWithEmail = async (signUpData: SignUpData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    user: {
      id: 'mock-user-id',
      email: signUpData.email,
      user_metadata: {
        first_name: signUpData.firstName,
        last_name: signUpData.lastName,
        role: signUpData.role,
        batch: signUpData.batch,
        department: signUpData.department,
        course: signUpData.course
      }
    }
  };
};

// Mock function - not actually using Supabase anymore
export const signInWithEmail = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    user: {
      id: 'mock-user-id',
      email: email,
      user_metadata: {
        role: email.includes('faculty') ? 'faculty' : 'student'
      }
    }
  };
};

// Mock function - not actually using Supabase anymore
export const signOut = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

// Mock function - not actually using Supabase anymore
export const getCurrentUser = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: 'mock-user-id',
    email: 'user@example.com',
    user_metadata: {
      first_name: 'Mock',
      last_name: 'User',
      role: 'student'
    }
  };
};

// Mock function - not actually using Supabase anymore
export const getCurrentProfile = async (): Promise<Profile> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: 'mock-user-id',
    first_name: 'Mock',
    last_name: 'User',
    email: 'user@example.com',
    role: 'student',
    batch: '2023-2027',
    course: 'B.Tech'
  };
};
