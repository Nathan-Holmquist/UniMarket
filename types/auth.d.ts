import { User as FirebaseUser } from 'firebase/auth';

// User profile data stored in Firestore
export interface UserProfile {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

// Combined user data (Firebase Auth + Firestore profile)
export interface AppUser {
    firebaseUser: FirebaseUser;
    profile: UserProfile;
}

// Auth context type
export interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (userData: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
}

// Signup form data
export interface SignupData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    address: string;
    password: string;
}

// Auth errors
export interface AuthError {
    code: string;
    message: string;
}
