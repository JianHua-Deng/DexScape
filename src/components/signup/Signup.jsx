import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Check } from "lucide-react";
import './Signup.css'
import Seperator from "../ui/seperator/Seperator";
import { useAuth } from "../../lib/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {

    const { signUp } = useAuth()

    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [confirmSignUpPassword, setConfirmSignUpPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [matchPassword, setMatchpassword] = useState(false);
    const [passwordRequirment, setPasswordRequirement] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false
    });
    const [passwordReqMet, setPasswordReqMet] = useState(false);

    function match_requirment(){
        return isEmailValid && passwordReqMet && matchPassword;
    }

    useEffect(() => {
        setIsEmailValid(
            // This checks if the email follows the general pattern something@domain.com
            // It is a regex i got from internet, dont know how it works at all
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(signUpEmail)
        );
    }, [signUpEmail]);

    // Check if the password met each individual requirement
    useEffect(() => {
        setPasswordRequirement({
            length: signUpPassword.length >= 6,
            uppercase: /[A-Z]/.test(signUpPassword),
            lowercase: /[a-z]/.test(signUpPassword),
            number: /[0-9]/.test(signUpPassword),
        })
    }, [signUpPassword]);

    // Check if the password met ALL requirement
    useEffect(() => {
        var requirementMet = Object.values(passwordRequirment).every(val => val);
        setPasswordReqMet(requirementMet);
    }, [passwordRequirment]);

    useEffect(() => {
        setMatchpassword(confirmSignUpPassword === signUpPassword && signUpPassword.length !== 0);
    }, [confirmSignUpPassword]);

    async function handleSignUpSubmit(){
        if (match_requirment()){
            try{
                await signUp(signUpEmail, signUpPassword);
                toast.success('Signed up succesfully, check your email for verification');
                setSignUpEmail('');
                setSignUpPassword('');
                setConfirmSignUpPassword('');
            } catch (error) {
                if (error.message.includes("User already registered")){
                    toast("Email already registered");
                } else{
                    toast("Something went wrong");
                }
            }
        }
    }


    return (
        <div className="signup-form-container">
            <form className="signup-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignUpSubmit();
                }}
            >
                <div className="signup-email-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="signup-email"
                        className={isEmailValid ? 'valid' : ''}
                        placeholder="email@example.com"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="signup-password-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="signup-password"
                        className={`${passwordReqMet ? 'valid' : ''}`}
                        placeholder="Enter your password"
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="confirm-password-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        id="confirm-password"
                        className={`${matchPassword? 'valid' : ''}`}
                        placeholder="Re-enter your password"
                        type="password"
                        value={confirmSignUpPassword}
                        onChange={(e) => setConfirmSignUpPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="password-validation-indicator">

                    <div className='requirement'>
                    {passwordRequirment.length ? (
                        <Check size={16} color="green" />
                    ) : (
                        <X size={16} color="red" />
                    )}
                        <span>Minimum 6 characters</span>
                    </div>

                    <div className='requirement'>
                    {passwordRequirment.uppercase ? (
                        <Check size={16} color="green" />
                    ) : (
                        <X size={16} color="red" />
                    )}
                        <span>At least one uppercase letter</span>
                    </div>

                    <div className='requirement'>
                    {passwordRequirment.lowercase ? (
                        <Check size={16} color="green" />
                    ) : (
                        <X size={16} color="red" />
                    )}
                        <span>At least one lowercase letter</span>
                    </div>
                    <div className='requirement'>
                    {passwordRequirment.number ? (
                        <Check size={16} color="green" />
                    ) : (
                        <X size={16} color="red" />
                    )}
                        <span>At least one number</span>
                    </div>
                </div>

                <div className="submit-field">
                    <button type="submit" className="signup-button">Sign up</button>
                </div>

                <Seperator text={'Already have an account?'}/>

                <div className="other-options">
                    <Link to="/login">
                        <button>Back to Login</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}