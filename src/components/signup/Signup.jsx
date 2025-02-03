import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Check } from "lucide-react";
import './Signup.css'
import Seperator from "../ui/seperator/Seperator";

export default function Signup() {
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [confirmSignUpPassword, setConfirmSignUpPassword] = useState('');
    const [passwordRequirment, setPasswordRequirment] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false
    });

    useEffect(() => {
        setPasswordRequirment({
            length: signUpPassword.length >= 6,
            uppercase: /[A-Z]/.test(signUpPassword),
            lowercase: /[a-z]/.test(signUpPassword),
            number: /[0-9]/.test(signUpPassword),
        })
    }, [signUpPassword]);


    return (
        <div className="signup-form-container">
            <form className="signup-form">
                <div className="signup-email-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="signup-email"
                        placeholder="email@example.com"
                        type="email"
                        value={signUpEmail}
                        onChange={() => setSignUpEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="signup-password-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="signup-password"
                        placeholder="Enter your password"
                        type="password"
                        value={signUpPassword}
                        onChange={() => setSignUpPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="confirm-password-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        id="confirm-password"
                        placeholder="Re-enter your password"
                        type="password"
                        value={confirmSignUpPassword}
                        onChange={(e) => setConfirmSignUpPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="submit-field">
                    <button type="submit" className="signup-button">Sign up</button>
                </div>

                <Seperator text={'Already have an account?'}/>

                <div className="to-login">
                    <Link to="/login">
                        <button>Go back to Login</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}