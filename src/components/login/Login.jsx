import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../Utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export default function Login(){

    const { session } = useAuth();



    return (
        <div className='auth-container'>
            <Auth
                supabaseClient={supabase}
                appearance={ThemeSupa}
                providers={['google']}
            >
                
            </Auth>
        </div>
    )
}