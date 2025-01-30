import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../Utils/supabase';


export default function Login(){
    const { session } = useAuth();
    
    if (session){

    }

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