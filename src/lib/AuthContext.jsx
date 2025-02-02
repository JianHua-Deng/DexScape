import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'
import { supabase } from '../Utils/supabase';


const AuthContext = createContext();

export default function AuthProvider({ children }){
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data : { session } }) => {
            setSession(session);
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event,session) => {
            setSession(session);
        })
        
        return () => subscription.unsubscribe();
    }, []);

    const authValue = {
        session,
        signOut: () => supabase.auth.signOut(),
    }

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}


