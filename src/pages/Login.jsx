import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
} from "../hooks/useAuth";
import { useCurrentUser } from "../hooks/useAuth";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.lp-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: #f0fdf4;
    display: flex;
    flex-direction: column;
}
.lp-page::before {
    content: '';
    position: fixed; inset: 0;
    background:
        radial-gradient(ellipse 80% 60% at 0% 0%, rgba(22,163,74,0.1) 0%, transparent 55%),
        radial-gradient(ellipse 60% 70% at 100% 100%, rgba(22,163,74,0.07) 0%, transparent 55%);
    pointer-events: none; z-index: 0;
}
.lp-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 20px;
    position: relative; z-index: 1;
}

.lp-card {
    width: 100%;
    max-width: 460px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 24px;
    padding: 44px 40px 40px;
    box-shadow:
        0 0 0 1px rgba(22,163,74,0.04),
        0 24px 60px rgba(0,0,0,0.09),
        0 4px 16px rgba(0,0,0,0.05);
    animation: lp-up 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes lp-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

.lp-logo {
    display: inline-flex; align-items: center; gap: 1px;
    font-size: 1.35rem; font-weight: 800; color: #0f172a;
    text-decoration: none; letter-spacing: -0.5px;
    margin-bottom: 30px;
}
.lp-logo em  { color: #16a34a; font-style: normal; }
.lp-logo sup { color: #16a34a; font-size: 1.7rem; line-height: 0; vertical-align: -0.15em; }

.lp-h1  { font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 5px; letter-spacing: -0.5px; line-height: 1.2; }
.lp-sub { font-size: 0.82rem; color: #94a3b8; font-weight: 400; margin-bottom: 26px; }

.lp-alert {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 14px; border-radius: 11px;
    font-size: 0.8rem; font-weight: 500; line-height: 1.5; margin-bottom: 16px;
    animation: lp-alert-in 0.25s cubic-bezier(0.34,1.3,0.64,1) both;
}
@keyframes lp-alert-in {
    from { opacity: 0; transform: translateY(-5px) scale(0.98); }
    to   { opacity: 1; transform: none; }
}
.lp-alert-ico { width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.58rem; font-weight: 800; }
.lp-alert.err  { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.lp-alert.err  .lp-alert-ico { background: #fda4af; color: #9f1239; }
.lp-alert.ok   { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.lp-alert.ok   .lp-alert-ico { background: #86efac; color: #14532d; }
.lp-alert.inf  { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1e40af; }
.lp-alert.inf  .lp-alert-ico { background: #93c5fd; color: #1e40af; }
.lp-alert-body { flex: 1; }
.lp-alert-ttl  { font-weight: 700; font-size: 0.79rem; margin-bottom: 1px; }
.lp-alert-msg  { font-size: 0.77rem; opacity: 0.88; }
.lp-alert-x    { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.38; font-size: 0.9rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.lp-alert-x:hover { opacity: 1; }

.lp-google-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.2s;
    background: #fff; color: #0f172a; border: 1.5px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 18px;
}
.lp-google-btn:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
.lp-google-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.lp-div { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; }
.lp-div-line { flex: 1; height: 1.5px; background: #f1f5f9; }
.lp-div-text { font-size: 0.67rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }

.lp-field { margin-bottom: 10px; }
.lp-pass-wrap { position: relative; }
.lp-pass-wrap .lp-inp { padding-right: 42px; }
.lp-eye-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0;
    color: #94a3b8; display: flex; align-items: center; transition: color 0.18s;
}
.lp-eye-btn:hover { color: #475569; }

.lp-inp {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; color: #0f172a; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-weight: 500;
}
.lp-inp::placeholder { color: #cbd5e1; font-weight: 400; }
.lp-inp:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.lp-inp:disabled { opacity: 0.55; cursor: not-allowed; }

.lp-forgot {
    display: block; text-align: right;
    font-size: 0.74rem; font-weight: 600; color: #16a34a;
    background: none; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 0; margin-top: -4px; margin-bottom: 10px;
    transition: color 0.18s;
}
.lp-forgot:hover { color: #15803d; text-decoration: underline; }

.lp-btn {
    width: 100%; padding: 13px; border-radius: 12px;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; border: none;
    cursor: pointer; transition: all 0.22s; margin-top: 6px;
    background: #16a34a; color: #fff;
    box-shadow: 0 4px 18px rgba(22,163,74,0.32);
}
.lp-btn:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(22,163,74,0.42); }
.lp-btn:active { transform: scale(0.98); }
.lp-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

.lp-dots { display: inline-flex; align-items: center; gap: 4px; }
.lp-dots span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.85); display: inline-block; animation: lp-dot 1.1s ease-in-out infinite; }
.lp-dots span:nth-child(2) { animation-delay: 0.18s; }
.lp-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes lp-dot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }

.lp-note   { font-size: 0.74rem; color: #94a3b8; text-align: center; margin-top: 10px; line-height: 1.6; }
.lp-switch { font-size: 0.8rem; color: #64748b; text-align: center; margin-top: 16px; }
.lp-sw-btn { background: none; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: inherit; color: #16a34a; font-weight: 700; cursor: pointer; padding: 0; }
.lp-sw-btn:hover { text-decoration: underline; }

.lp-foot { font-size: 0.68rem; color: #94a3b8; text-align: center; padding: 0 0 28px; position: relative; z-index: 1; }

@media (max-width: 520px) {
    .lp-main { padding: 28px 14px; }
    .lp-card { padding: 32px 22px 28px; border-radius: 20px; }
    .lp-h1   { font-size: 1.4rem; }
}
`;

const ERR = {
    'auth/invalid-email':             'Invalid email address format.',
    'auth/user-not-found':            'No account found with this email.',
    'auth/wrong-password':            'Incorrect password. Please try again.',
    'auth/email-already-in-use':      'This email is already registered.',
    'auth/weak-password':             'Password must be at least 6 characters.',
    'auth/invalid-credential':        'Invalid email or password.',
    'auth/network-request-failed':    'Network error. Check your connection.',
    'auth/too-many-requests':         'Too many attempts. Please try again later.',
};
const getMsg = (err) => ERR[err.code] || err.message || 'Something went wrong. Please try again.';

const Alert = ({ type, title, message, onDismiss }) => {
    const cls  = type === 'error' ? 'err' : type === 'success' ? 'ok' : 'inf';
    const icon = type === 'error' ? '✕' : type === 'success' ? '✓' : 'i';
    return (
        <div className={`lp-alert ${cls}`}>
            <div className="lp-alert-ico">{icon}</div>
            <div className="lp-alert-body">
                {title && <div className="lp-alert-ttl">{title}</div>}
                <div className="lp-alert-msg">{message}</div>
            </div>
            {onDismiss && <button className="lp-alert-x" onClick={onDismiss} type="button">✕</button>}
        </div>
    );
};

const EyeOn = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);
const EyeOff = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

const PassInput = ({ placeholder, value, onChange, disabled }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="lp-pass-wrap">
            <input
                className="lp-inp"
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
            <button className="lp-eye-btn" type="button" onClick={() => setShow(s => !s)} tabIndex={-1}>
                {show ? <EyeOff /> : <EyeOn />}
            </button>
        </div>
    );
};

export default function Login() {
    const navigate = useNavigate();
    const { user } = useCurrentUser();

    const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
    const [busy, setBusy] = useState(false);
    const [alrt, setAlrt] = useState(null);

    const [email,   setEmail]   = useState("");
    const [pass,    setPass]    = useState("");
    const [confirm, setConfirm] = useState("");
    const [name,    setName]    = useState("");

    const show  = (type, msg, ttl = null) => setAlrt({ type, message: msg, title: ttl });
    const clear = () => setAlrt(null);

    useEffect(() => {
        if (user) { show('success', 'Redirecting…', 'Welcome back!'); setTimeout(() => navigate("/"), 1200); }
    }, [user, navigate]);
    useEffect(() => { clear(); setPass(""); setConfirm(""); }, [mode]);

    const doGoogle = async () => {
        clear(); setBusy(true);
        try { await loginWithGoogle(); }
        catch (e) { show('error', getMsg(e)); }
        finally { setBusy(false); }
    };

    const doEmail = async (e) => {
        e.preventDefault(); clear();
        if (!email || !pass)                         { show('error', 'Please fill in all fields.'); return; }
        if (mode === 'register' && !name.trim())     { show('error', 'Please enter your full name.'); return; }
        if (pass.length < 6)                         { show('error', 'Password must be at least 6 characters.'); return; }
        if (mode === 'register' && pass !== confirm) { show('error', 'Passwords do not match.'); return; }
        setBusy(true);
        try {
            if (mode === 'register') {
                await registerWithEmail(email, pass, name);
                show('success', 'Check your inbox to verify your email.', 'Account created!');
                setEmail(""); setPass(""); setConfirm(""); setName(""); setMode("login");
            } else {
                await loginWithEmail(email, pass);
            }
        } catch (e) { show('error', getMsg(e)); }
        finally { setBusy(false); }
    };

    const doForgot = async (e) => {
        e.preventDefault(); clear();
        if (!email) { show('error', 'Please enter your email address.'); return; }
        setBusy(true);
        try {
            await resetPassword(email);
            show('success', 'Password reset email sent. Check your inbox.', 'Email sent!');
            setEmail("");
        } catch (e) { show('error', getMsg(e)); }
        finally { setBusy(false); }
    };

    const Dots = () => <span className="lp-dots"><span /><span /><span /></span>;

    const heading = mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Reset password' : 'Welcome back.';
    const subtext = mode === 'register' ? 'Start your MartXen journey today' : mode === 'forgot' ? 'Enter your email to receive a reset link' : 'Sign in to continue shopping';

    return (
        <>
            <style>{CSS}</style>
            <div className="lp-page">
                <div className="lp-main">
                    <div className="lp-card">

                        <Link to="/" className="lp-logo">
                            <em>Mart</em>Xen<sup>.</sup>
                        </Link>

                        <h1 className="lp-h1">{heading}</h1>
                        <p className="lp-sub">{subtext}</p>

                        {/* ── Google — শুধু login/register এ ── */}
                        {mode !== 'forgot' && (
                            <>
                                <button className="lp-google-btn" onClick={doGoogle} disabled={busy} type="button">
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={16} height={16} alt="" />
                                    Continue with Google
                                </button>
                                <div className="lp-div">
                                    <div className="lp-div-line" />
                                    <span className="lp-div-text">or continue with email</span>
                                    <div className="lp-div-line" />
                                </div>
                            </>
                        )}

                        {/* ── Forgot Password ── */}
                        {mode === 'forgot' && (
                            <form onSubmit={doForgot}>
                                {alrt && <Alert type={alrt.type} title={alrt.title} message={alrt.message} onDismiss={clear} />}
                                <div className="lp-field">
                                    <input className="lp-inp" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} disabled={busy} />
                                </div>
                                <button className="lp-btn" type="submit" disabled={busy}>
                                    {busy ? <Dots /> : 'Send Reset Link'}
                                </button>
                                <p className="lp-switch">
                                    Remember your password?{" "}
                                    <button className="lp-sw-btn" onClick={() => setMode("login")} type="button">Sign in</button>
                                </p>
                            </form>
                        )}

                        {/* ── Email form ── */}
                        {mode !== 'forgot' && (
                            <form onSubmit={doEmail}>
                                {alrt && <Alert type={alrt.type} title={alrt.title} message={alrt.message} onDismiss={clear} />}
                                {mode === 'register' && (
                                    <div className="lp-field">
                                        <input className="lp-inp" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} disabled={busy} />
                                    </div>
                                )}
                                <div className="lp-field">
                                    <input className="lp-inp" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} disabled={busy} />
                                </div>
                                <div className="lp-field">
                                    <PassInput placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} disabled={busy} />
                                </div>
                                {mode === 'register' && (
                                    <div className="lp-field">
                                        <PassInput placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} disabled={busy} />
                                    </div>
                                )}
                                {mode === 'login' && (
                                    <button className="lp-forgot" type="button" onClick={() => setMode('forgot')}>
                                        Forgot password?
                                    </button>
                                )}
                                <button className="lp-btn" type="submit" disabled={busy}>
                                    {busy ? <Dots /> : mode === 'login' ? 'Sign In' : 'Create Account'}
                                </button>
                                {mode === 'register' && (
                                    <p className="lp-note">A verification email will be sent to your inbox.</p>
                                )}
                                <p className="lp-switch">
                                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                    <button className="lp-sw-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} type="button">
                                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                                    </button>
                                </p>
                            </form>
                        )}

                    </div>
                </div>
                <p className="lp-foot">© 2025 MartXen · All rights reserved.</p>
            </div>
        </>
    );
}