import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase.config';
import { AuthContextType, AppUser, UserProfile, SignupData } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in, fetch their profile
                await loadUserProfile(firebaseUser);
            } else {
                // User is signed out
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Load user profile from Firestore
    async function loadUserProfile(firebaseUser: FirebaseUser) {
        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const profile = userDoc.data() as UserProfile;
                setUser({ firebaseUser, profile });
            } else {
                console.error('User profile not found in Firestore');
                setUser(null);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            setUser(null);
        }
    }

    // Login function
    async function login(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle loading the profile
    }

    // Signup function
    async function signup(userData: SignupData) {
        const { email, password, firstName, lastName, username, address } = userData;

        // Create Firebase Auth account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Create Firestore user profile document
        const userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> & { createdAt: any; updatedAt: any } = {
            uid: firebaseUser.uid,
            email: email,
            firstName,
            lastName,
            username,
            address,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
        // onAuthStateChanged will handle loading the profile
    }

    // Logout function
    async function logout() {
        await signOut(auth);
        // onAuthStateChanged will handle clearing the user
    }

    // Refresh user profile (useful after updates)
    async function refreshUserProfile() {
        if (auth.currentUser) {
            await loadUserProfile(auth.currentUser);
        }
    }

    const value: AuthContextType = {
        user,
        loading,
        login,
        signup,
        logout,
        refreshUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
