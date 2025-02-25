import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [userID, setUserID] = useState( null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Handle initial session load with error handling
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                setSession(session);
            })
            .catch((error) => {
                console.error('Error getting initial session:', error);
            })
            .finally(() => {
                setLoading(false);
            });

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {

      const getUserID = async () => {
        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          setUserID(user?.id);
          //console.log(user?.id);
        }
      }

      getUserID();
    }, [session])

    async function signUp(email, password) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            
            console.log(data);
            if (error) throw error;

        } catch (error) {
            throw new Error(`Signup failed: ${error.message}`);
        }
    }

    async function login(email, password) {
        try {
            // Updated to use signInWithPassword which is the current method
            const { user, session, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async function googleSignin() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });

            if (error) throw error;
            //return data;
        } catch (error) {
            throw new Error(`Google sign-in failed: ${error.message}`);
        }
    }

    async function signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            throw new Error(`Logout failed: ${error.message}`);
        }
    }

    const authValue = {
        session,
        userID,
        loading,
        signUp,
        login,
        googleSignin,
        signOut
    };

    return (
        <AuthContext.Provider value={authValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}