import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../utils/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Login.css'
import Seperator from '../ui/seperator/Seperator';


export default function Login(){

    const { session } = useAuth();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    return (
        <div className='login-form-container'>
            <form className='login-form'>
                <div className='email-field'>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        placeholder="email@example.com"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='password-field'>
                <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        placeholder="email@example.com"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='submit-field'>
                    <button type='submit' className='login-button'>Log in</button>
                </div>

                <Seperator text={'Dont have an account?'}/>

                <div className='to-signup'>
                    <Link to='/signup'>
                        <button>Sign up</button>
                    </Link>
                </div>
            </form>

        </div>
    )
}