import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Check } from "lucide-react";
import Seperator from "../ui/Seperator";
import { useAuth } from "../../lib/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
  const { signUp } = useAuth();

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmSignUpPassword, setConfirmSignUpPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [matchPassword, setMatchpassword] = useState(false);
  const [passwordRequirment, setPasswordRequirement] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });
  const [passwordReqMet, setPasswordReqMet] = useState(false);

  function match_requirment() {
    return isEmailValid && passwordReqMet && matchPassword;
  }

  useEffect(() => {
    // Got the regex from the internet, dont know how it works but it works
    setIsEmailValid(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        signUpEmail
      )
    );
  }, [signUpEmail]);

  useEffect(() => {
    setPasswordRequirement({
      length: signUpPassword.length >= 6,
      uppercase: /[A-Z]/.test(signUpPassword),
      lowercase: /[a-z]/.test(signUpPassword),
      number: /[0-9]/.test(signUpPassword),
    });
  }, [signUpPassword]);

  useEffect(() => {
    const requirementMet = Object.values(passwordRequirment).every((val) => val);
    setPasswordReqMet(requirementMet);
  }, [passwordRequirment]);

  useEffect(() => {
    setMatchpassword(
      confirmSignUpPassword === signUpPassword && signUpPassword.length !== 0
    );
  }, [confirmSignUpPassword, signUpPassword]);

  async function handleSignUpSubmit() {
    if (match_requirment()) {
      try {
        await signUp(signUpEmail, signUpPassword);
        toast.success(
          "Signed up succesfully, check your email for verification"
        );
        setSignUpEmail("");
        setSignUpPassword("");
        setConfirmSignUpPassword("");
      } catch (error) {
        if (error.message.includes("User already registered")) {
          toast("Email already registered");
        } else {
          toast("Something went wrong");
        }
      }
    }
  }

  // Shared base styles for the input fields.
  const baseInputClass =
    "w-56 md:w-96 h-12 rounded-[0.5rem] border-[0.1rem] border-bg-blue-600 p-[0.75rem] focus:outline-none focus:border-[0.13rem] focus:border-blue-800";
  // When valid, override the border color.
  const validClass =
    "border-[rgb(79,202,79)] focus:border-[rgb(79,202,79)]";

  return (
    // Container equivalent to .signup-form-container
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      {/* Form container equivalent to .signup-form */}
      <form
        className="max-w-[50rem] w-full h-full flex flex-col justify-center items-center gap-7"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUpSubmit();
        }}
      >
        {/* Email field container */}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            placeholder="email@example.com"
            type="email"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            required
            className={`${baseInputClass} ${isEmailValid ? validClass : ""}`}
          />
        </div>
        {/* Password field container */}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            placeholder="Enter your password"
            type="password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            required
            className={`${baseInputClass} ${passwordReqMet ? validClass : ""}`}
          />
        </div>
        {/* Confirm Password field container */}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            placeholder="Re-enter your password"
            type="password"
            value={confirmSignUpPassword}
            onChange={(e) => setConfirmSignUpPassword(e.target.value)}
            required
            className={`${baseInputClass} ${matchPassword ? validClass : ""}`}
          />
        </div>

        {/* Password validation indicators */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {passwordRequirment.length ? (
              <Check size={16} color="green" />
            ) : (
              <X size={16} color="red" />
            )}
            <span className="text-gray-500">Minimum 6 characters</span>
          </div>
          <div className="flex items-center gap-2">
            {passwordRequirment.uppercase ? (
              <Check size={16} color="green" />
            ) : (
              <X size={16} color="red" />
            )}
            <span className="text-gray-500">At least one uppercase letter</span>
          </div>
          <div className="flex items-center gap-2">
            {passwordRequirment.lowercase ? (
              <Check size={16} color="green" />
            ) : (
              <X size={16} color="red" />
            )}
            <span className="text-gray-500">At least one lowercase letter</span>
          </div>
          <div className="flex items-center gap-2">
            {passwordRequirment.number ? (
              <Check size={16} color="green" />
            ) : (
              <X size={16} color="red" />
            )}
            <span className="text-gray-500">At least one number</span>
          </div>
        </div>

        {/* Submit button container */}
        <div className="flex flex-col justify-center items-center gap-4">
          <button type="submit" className="signup-button">
            Sign up
          </button>
        </div>

        <Seperator text={"Already have an account?"} />

        {/* Other options container */}
        <div className="other-options">
          <Link to="/login">
            <button>Back to Login</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
