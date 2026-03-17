import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFloatingToast } from "../components/FloatingToastProvider";
import {
    loginWithGoogle,
    loginWithFacebook,
    loginWithEmail,
    registerWithEmail,
    setupRecaptcha,
    sendPhoneOTP,
} from "../hooks/useAuth";
import { useCurrentUser } from "../hooks/useAuth";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.lp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: #fff;
}

/* ══════════════════════════════
   LEFT PANEL
══════════════════════════════ */
.lp-left {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 44%;
    flex-shrink: 0;
    background: #0a0f1a;
    padding: 52px 56px;
    position: relative;
    overflow: hidden;
}
@media (min-width: 1024px) { .lp-left { display: flex; } }

/* ── Animated orb blobs ── */
.lp-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 60% 50% at 20% 20%, rgba(22,163,74,0.22) 0%, transparent 70%),
        radial-gradient(ellipse 50% 60% at 80% 80%, rgba(22,163,74,0.12) 0%, transparent 70%);
    pointer-events: none;
    animation: lp-blob-shift 10s ease-in-out infinite alternate;
}
@keyframes lp-blob-shift {
    0%   { background-position: 20% 20%, 80% 80%; opacity: 1; }
    50%  { background-position: 30% 30%, 70% 70%; opacity: 0.85; }
    100% { background-position: 15% 25%, 85% 75%; opacity: 1; }
}

/* ── Rotating ring ── */
.lp-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 340px; height: 340px;
    border-radius: 50%;
    border: 1.5px solid rgba(22,163,74,0.14);
    pointer-events: none;
    animation: lp-ring-spin 22s linear infinite;
}
@keyframes lp-ring-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

/* ── Floating particle dots ── */
.lp-particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(22,163,74,0.5);
    pointer-events: none;
    animation: lp-float linear infinite;
}
.lp-particle:nth-child(1) { width:4px; height:4px; left:15%; top:20%; animation-duration:7s; animation-delay:0s; }
.lp-particle:nth-child(2) { width:3px; height:3px; left:70%; top:35%; animation-duration:9s; animation-delay:1.5s; }
.lp-particle:nth-child(3) { width:5px; height:5px; left:40%; top:65%; animation-duration:11s; animation-delay:3s; }
.lp-particle:nth-child(4) { width:3px; height:3px; left:85%; top:15%; animation-duration:8s; animation-delay:0.8s; }
.lp-particle:nth-child(5) { width:4px; height:4px; left:25%; top:80%; animation-duration:10s; animation-delay:2s; }
@keyframes lp-float {
    0%   { transform: translateY(0px) scale(1); opacity: 0.6; }
    25%  { transform: translateY(-18px) scale(1.1); opacity: 1; }
    50%  { transform: translateY(-8px) scale(0.95); opacity: 0.7; }
    75%  { transform: translateY(-22px) scale(1.05); opacity: 0.9; }
    100% { transform: translateY(0px) scale(1); opacity: 0.6; }
}

.lp-logo {
    font-size: 1.75rem;
    font-weight: 800;
    color: #fff;
    text-decoration: none;
    letter-spacing: -0.5px;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 2px;
    animation: lp-fadeDown 0.7s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes lp-fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
}
.lp-logo-accent { color: #16a34a; }
.lp-logo-dot { color: #16a34a; font-size: 2.2rem; line-height: 0; margin-top: 6px; }

.lp-left-body {
    position: relative;
    z-index: 1;
    animation: lp-fadeUp 0.8s 0.25s cubic-bezier(0.4,0,0.2,1) both;
}
.lp-tagline {
    font-size: 2.4rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    margin: 0 0 16px;
    letter-spacing: -1px;
}
.lp-tagline-green { color: #4ade80; }
.lp-tagline-sub {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.75;
    max-width: 280px;
    margin: 0;
}

/* ── Feature items slide in one by one ── */
.lp-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 28px;
}
.lp-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #94a3b8;
    opacity: 0;
    animation: lp-slideRight 0.55s cubic-bezier(0.4,0,0.2,1) forwards;
}
.lp-feature:nth-child(1) { animation-delay: 0.5s; }
.lp-feature:nth-child(2) { animation-delay: 0.68s; }
.lp-feature:nth-child(3) { animation-delay: 0.86s; }
.lp-feature:nth-child(4) { animation-delay: 1.04s; }
@keyframes lp-slideRight {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
}
.lp-feature-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #16a34a;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(22,163,74,0.7);
    animation: lp-pulse-dot 2.5s ease-in-out infinite;
}
@keyframes lp-pulse-dot {
    0%, 100% { box-shadow: 0 0 6px rgba(22,163,74,0.6); transform: scale(1); }
    50%       { box-shadow: 0 0 14px rgba(22,163,74,0.9); transform: scale(1.3); }
}

.lp-copy {
    font-size: 0.72rem;
    color: #1e293b;
    position: relative;
    z-index: 1;
    animation: lp-fadeUp 0.6s 1.2s cubic-bezier(0.4,0,0.2,1) both;
}

/* ══════════════════════════════
   RIGHT PANEL
══════════════════════════════ */
.lp-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    background: #fff;
    overflow-y: auto;
}

.lp-form-wrap {
    width: 100%;
    max-width: 420px;
    animation: lp-fadeUp 0.65s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes lp-fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* mobile logo */
.lp-mobile-logo {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
    text-decoration: none;
    margin-bottom: 32px;
    letter-spacing: -0.5px;
    animation: lp-fadeDown 0.6s cubic-bezier(0.4,0,0.2,1) both;
}
@media (min-width: 1024px) { .lp-mobile-logo { display: none; } }
.lp-mobile-logo .lp-logo-accent { color: #16a34a; }
.lp-mobile-logo .lp-logo-dot { color: #16a34a; font-size: 1.9rem; line-height: 0; margin-top: 5px; }

.lp-heading {
    font-size: 1.625rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
    letter-spacing: -0.5px;
    animation: lp-fadeUp 0.5s 0.15s cubic-bezier(0.4,0,0.2,1) both;
}
.lp-subheading {
    font-size: 0.825rem;
    color: #94a3b8;
    margin: 0 0 28px;
    font-weight: 400;
    animation: lp-fadeUp 0.5s 0.22s cubic-bezier(0.4,0,0.2,1) both;
}

/* ── Social buttons ── */
.lp-social {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    animation: lp-fadeUp 0.5s 0.3s cubic-bezier(0.4,0,0.2,1) both;
}
.lp-social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 12px;
    border-radius: 14px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    border: none;
}
.lp-social-btn:active { transform: scale(0.97) !important; }
.lp-google-btn {
    background: #fff;
    color: #0f172a;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.lp-google-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    transform: translateY(-2px);
}
.lp-fb-btn {
    background: #1877F2;
    color: #fff;
    box-shadow: 0 4px 14px rgba(24,119,242,0.3);
}
.lp-fb-btn:hover {
    background: #166FE5;
    box-shadow: 0 8px 22px rgba(24,119,242,0.4);
    transform: translateY(-2px);
}

/* ── Divider ── */
.lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    animation: lp-fadeUp 0.5s 0.38s cubic-bezier(0.4,0,0.2,1) both;
}
.lp-divider-line {
    flex: 1;
    height: 1.5px;
    background: #f1f5f9;
}
.lp-divider-text {
    font-size: 0.72rem;
    font-weight: 600;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* ── Tab switcher ── */
.lp-tabs {
    display: flex;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 14px;
    padding: 4px;
    gap: 4px;
    margin-bottom: 22px;
    animation: lp-fadeUp 0.5s 0.44s cubic-bezier(0.4,0,0.2,1) both;
}
.lp-tab {
    flex: 1;
    padding: 9px;
    border-radius: 10px;
    font-size: 0.825rem;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    color: #94a3b8;
    background: transparent;
}
.lp-tab:hover { color: #64748b; }
.lp-tab.active {
    background: #0f172a;
    color: #fff;
    box-shadow: 0 3px 12px rgba(15,23,42,0.2);
    transform: scale(1.02);
}

/* ── Inputs ── */
.lp-field {
    position: relative;
    margin-bottom: 12px;
    animation: lp-fieldIn 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes lp-fieldIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}
.lp-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #f1f5f9;
    border-radius: 14px;
    font-size: 0.875rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc;
    color: #0f172a;
    outline: none;
    transition: border-color 0.22s, background 0.22s, box-shadow 0.22s, transform 0.18s;
    font-weight: 500;
}
.lp-input::placeholder { color: #cbd5e1; font-weight: 400; }
.lp-input:focus {
    border-color: #16a34a;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(22,163,74,0.09);
    transform: translateY(-1px);
}
.lp-input:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }

/* OTP input special */
.lp-input.otp {
    text-align: center;
    letter-spacing: 10px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
    padding: 14px;
}
.lp-input.otp:focus { border-color: #16a34a; }

/* phone row */
.lp-phone-row {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}
.lp-phone-row .lp-input { flex: 1; margin-bottom: 0; }
.lp-send-btn {
    padding: 0 20px;
    background: #0f172a;
    color: #fff;
    font-size: 0.825rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    white-space: nowrap;
    flex-shrink: 0;
}
.lp-send-btn:hover:not(:disabled) {
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(15,23,42,0.2);
}
.lp-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.lp-send-btn.sent {
    background: #f0fdf4;
    color: #16a34a;
    border: 1.5px solid #bbf7d0;
}

/* ── Submit button with shimmer ── */
.lp-submit-btn {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    font-size: 0.9rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    margin-top: 4px;
    position: relative;
    overflow: hidden;
}
/* shimmer sweep on hover */
.lp-submit-btn::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 55%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: left 0.55s ease;
    pointer-events: none;
}
.lp-submit-btn:hover::after { left: 160%; }

.lp-submit-btn.primary {
    background: #16a34a;
    color: #fff;
    box-shadow: 0 4px 18px rgba(22,163,74,0.32);
}
.lp-submit-btn.primary:hover:not(:disabled) {
    background: #15803d;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(22,163,74,0.42);
}
.lp-submit-btn.primary:active { transform: scale(0.98); box-shadow: none; }
.lp-submit-btn.secondary {
    background: #0f172a;
    color: #fff;
    box-shadow: 0 4px 14px rgba(15,23,42,0.18);
}
.lp-submit-btn.secondary:hover:not(:disabled) {
    background: #1e293b;
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(15,23,42,0.25);
}
.lp-submit-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

/* loading dots inside button */
.lp-loading-dots {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.lp-loading-dots span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.85);
    display: inline-block;
    animation: lp-dot-bounce 1.1s ease-in-out infinite;
}
.lp-loading-dots span:nth-child(2) { animation-delay: 0.18s; }
.lp-loading-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes lp-dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
    40%            { transform: translateY(-6px); opacity: 1; }
}

/* ── Footer note ── */
.lp-note {
    font-size: 0.775rem;
    color: #94a3b8;
    text-align: center;
    margin-top: 10px;
    font-weight: 400;
    line-height: 1.6;
    animation: lp-fadeUp 0.4s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}

/* ── Toggle mode ── */
.lp-toggle {
    font-size: 0.825rem;
    color: #64748b;
    text-align: center;
    margin-top: 18px;
    font-weight: 400;
    animation: lp-fadeUp 0.4s 0.15s cubic-bezier(0.4,0,0.2,1) both;
}
.lp-toggle-btn {
    background: none;
    border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: inherit;
    color: #16a34a;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    transition: color 0.18s, letter-spacing 0.2s;
}
.lp-toggle-btn:hover { color: #15803d; text-decoration: underline; }

/* ── Change number ── */
.lp-change-num {
    background: none;
    border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.775rem;
    color: #94a3b8;
    cursor: pointer;
    padding: 0;
    display: block;
    margin: 8px auto 0;
    transition: color 0.18s;
}
.lp-change-num:hover { color: #64748b; }

@media (max-width: 480px) {
    .lp-right { padding: 28px 16px; }
    .lp-heading { font-size: 1.4rem; }
}
`;

// ✅ Helper function to get meaningful error messages
const getErrorMessage = (error) => {
    const errorCode = error.code;
    const errorMessages = {
        // Email/Password errors
        'auth/invalid-email': 'Invalid email address format',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already registered',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/operation-not-allowed': 'Operation not allowed',
        'auth/invalid-credential': 'Invalid email or password',
        
        // Phone errors
        'auth/invalid-phone-number': 'Invalid phone number format',
        'auth/missing-phone-number': 'Phone number is required',
        'auth/quota-exceeded': 'SMS quota exceeded. Try again later',
        'auth/invalid-verification-code': 'Invalid OTP code',
        'auth/invalid-verification-id': 'Invalid verification ID',
        'auth/code-expired': 'OTP has expired. Request a new one',
        
        // Google/Facebook errors
        'auth/popup-closed-by-user': 'Sign-in popup was closed',
        'auth/cancelled-popup-request': 'Sign-in cancelled',
        'auth/popup-blocked': 'Popup blocked. Please allow popups',
        'auth/account-exists-with-different-credential': 'Account exists with different sign-in method',
        
        // Network errors
        'auth/network-request-failed': 'Network error. Check your connection',
        'auth/too-many-requests': 'Too many attempts. Try again later',
        'auth/timeout': 'Request timed out. Try again',
        
        // reCAPTCHA errors
        'auth/captcha-check-failed': 'reCAPTCHA verification failed',
        'auth/missing-app-credential': 'reCAPTCHA not configured',
    };

    return errorMessages[errorCode] || error.message || 'Something went wrong';
};

const Login = () => {
    const navigate = useNavigate();
    const { user } = useCurrentUser();
    const { addToast } = useFloatingToast();
    const [tab, setTab] = useState("email");
    const [mode, setMode] = useState("login");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmResult, setConfirmResult] = useState(null);
    const [otpSent, setOtpSent] = useState(false);

    // ✅ User logged in - redirect with toast
    useEffect(() => {
        if (user) {
            addToast({
                message: "Welcome back!",
                title: "Successfully logged in",
                type: "success",
            });
            setTimeout(() => navigate("/"), 1000);
        }
    }, [user, navigate, addToast]);

    // ✅ Google Login Handler with Toast
    const handleGoogle = async () => {
        try {
            setLoading(true);
            await loginWithGoogle();
            addToast({
                message: "Signed in with Google",
                type: "success",
            });
        } catch (err) {
            addToast({
                message: getErrorMessage(err),
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Facebook Login Handler with Toast
    const handleFacebook = async () => {
        try {
            setLoading(true);
            await loginWithFacebook();
            addToast({
                message: "Signed in with Facebook",
                type: "success",
            });
        } catch (err) {
            addToast({
                message: getErrorMessage(err),
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Email Submit Handler with Toast
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!email || !password) {
            addToast({
                message: "Please fill in all fields",
                type: "error",
            });
            return;
        }

        if (mode === "register" && !name) {
            addToast({
                message: "Name is required",
                type: "error",
            });
            return;
        }

        if (password.length < 6) {
            addToast({
                message: "Password must be at least 6 characters",
                type: "error",
            });
            return;
        }

        setLoading(true);
        try {
            if (mode === "register") {
                await registerWithEmail(email, password, name);
                addToast({
                    message: "Account created successfully!",
                    title: "Please verify your email",
                    type: "success",
                });
                // Reset form
                setEmail("");
                setPassword("");
                setName("");
                setMode("login");
            } else {
                await loginWithEmail(email, password);
                addToast({
                    message: "Welcome back!",
                    type: "success",
                });
            }
        } catch (err) {
            addToast({
                message: getErrorMessage(err),
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Send OTP Handler with Toast
    const handleSendOTP = async () => {
        if (!phone) {
            addToast({
                message: "Phone number is required",
                type: "error",
            });
            return;
        }

        if (!phone.startsWith('+')) {
            addToast({
                message: "Phone number must start with country code (e.g., +880)",
                type: "error",
            });
            return;
        }

        setLoading(true);
        try {
            setupRecaptcha("recaptcha-container");
            const result = await sendPhoneOTP(phone);
            setConfirmResult(result);
            setOtpSent(true);
            addToast({
                message: "OTP sent successfully",
                title: "Check your phone for the code",
                type: "success",
            });
        } catch (err) {
            addToast({
                message: getErrorMessage(err),
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Verify OTP Handler with Toast
    const handleVerifyOTP = async () => {
        if (!otp) {
            addToast({
                message: "Please enter the OTP code",
                type: "error",
            });
            return;
        }

        if (otp.length !== 6) {
            addToast({
                message: "OTP must be 6 digits",
                type: "error",
            });
            return;
        }

        setLoading(true);
        try {
            await confirmResult.confirm(otp);
            addToast({
                message: "Phone verified successfully!",
                type: "success",
            });
        } catch (err) {
            addToast({
                message: getErrorMessage(err),
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Loading dots component
    const LoadingDots = () => (
        <span className="lp-loading-dots">
            <span /><span /><span />
        </span>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="lp-root">

                {/* ── Left branding ── */}
                <div className="lp-left">
                    {/* Floating particles */}
                    <div className="lp-particle" />
                    <div className="lp-particle" />
                    <div className="lp-particle" />
                    <div className="lp-particle" />
                    <div className="lp-particle" />

                    <Link to="/" className="lp-logo">
                        <span className="lp-logo-accent">Dynamicx</span>Mart
                        <span className="lp-logo-dot">.</span>
                    </Link>

                    <div className="lp-left-body">
                        <h2 className="lp-tagline">
                            Gadgets you'll love.<br />
                            <span className="lp-tagline-green">Prices you'll trust.</span>
                        </h2>
                        <p className="lp-tagline-sub">
                            Join thousands of happy customers shopping the latest tech at unbeatable prices.
                        </p>
                        <div className="lp-features">
                            {["Free worldwide shipping", "100% secured payment", "Trusted by top brands", "Easy returns & refunds"].map(f => (
                                <div key={f} className="lp-feature">
                                    <span className="lp-feature-dot" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="lp-copy">© 2025 DynamicxMart. All rights reserved.</p>
                </div>

                {/* ── Right form ── */}
                <div className="lp-right">
                    <div className="lp-form-wrap">

                        {/* Mobile logo */}
                        <Link to="/" className="lp-mobile-logo">
                            <span className="lp-logo-accent">Dynamicx</span>Mart
                            <span className="lp-logo-dot">.</span>
                        </Link>

                        <h1 className="lp-heading">
                            {mode === "login" ? "Welcome back." : "Create account"}
                        </h1>
                        <p className="lp-subheading">
                            {mode === "login" ? "Sign in to continue shopping" : "Start your DynamicxMart journey today"}
                        </p>

                        {/* Social */}
                        <div className="lp-social">
                            <button className="lp-social-btn lp-google-btn" onClick={handleGoogle} disabled={loading}>
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={18} height={18} alt="Google" />
                                Continue with Google
                            </button>
                            <button className="lp-social-btn lp-fb-btn" onClick={handleFacebook} disabled={loading}>
                                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Continue with Facebook
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="lp-divider">
                            <div className="lp-divider-line" />
                            <span className="lp-divider-text">or</span>
                            <div className="lp-divider-line" />
                        </div>

                        {/* Tabs */}
                        <div className="lp-tabs">
                            {["email", "phone"].map(t => (
                                <button
                                    key={t}
                                    className={`lp-tab ${tab === t ? 'active' : ''}`}
                                    onClick={() => setTab(t)}
                                    type="button"
                                >
                                    {t === "email" ? "Email" : "Phone OTP"}
                                </button>
                            ))}
                        </div>

                        {/* Email form */}
                        {tab === "email" && (
                            <div>
                                {mode === "register" && (
                                    <div className="lp-field" style={{ animationDelay: '0s' }}>
                                        <input
                                            className="lp-input"
                                            type="text"
                                            placeholder="Full name"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="lp-field" style={{ animationDelay: '0.05s' }}>
                                    <input
                                        className="lp-input"
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="lp-field" style={{ animationDelay: '0.1s' }}>
                                    <input
                                        className="lp-input"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="lp-submit-btn primary"
                                    onClick={handleEmailSubmit}
                                    disabled={loading}
                                    type="button"
                                >
                                    {loading ? <LoadingDots /> : mode === "login" ? "Sign In" : "Create Account"}
                                </button>
                                {mode === "register" && (
                                    <p className="lp-note">A verification email will be sent to your inbox.</p>
                                )}
                                <p className="lp-toggle">
                                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        className="lp-toggle-btn"
                                        onClick={() => setMode(mode === "login" ? "register" : "login")}
                                        type="button"
                                    >
                                        {mode === "login" ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                            </div>
                        )}

                        {/* Phone OTP form */}
                        {tab === "phone" && (
                            <div>
                                <div id="recaptcha-container" />
                                <div className="lp-phone-row">
                                    <input
                                        className="lp-input"
                                        type="tel"
                                        placeholder="+8801XXXXXXXXX"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        disabled={otpSent || loading}
                                    />
                                    <button
                                        className={`lp-send-btn ${otpSent ? 'sent' : ''}`}
                                        onClick={handleSendOTP}
                                        disabled={loading || otpSent}
                                        type="button"
                                    >
                                        {otpSent ? "Sent ✓" : "Send OTP"}
                                    </button>
                                </div>
                                {otpSent && (
                                    <>
                                        <div className="lp-field">
                                            <input
                                                className="lp-input otp"
                                                type="text"
                                                placeholder="• • • • • •"
                                                value={otp}
                                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                maxLength={6}
                                            />
                                        </div>
                                        <button
                                            className="lp-submit-btn primary"
                                            onClick={handleVerifyOTP}
                                            disabled={loading}
                                            type="button"
                                        >
                                            {loading ? <LoadingDots /> : "Verify & Sign In"}
                                        </button>
                                        <button
                                            className="lp-change-num"
                                            onClick={() => { setOtpSent(false); setConfirmResult(null); setOtp(""); }}
                                            type="button"
                                        >
                                            ← Change number
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;