import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    loginWithGoogle, loginWithFacebook,
    loginWithEmail, registerWithEmail,
    setupRecaptcha, sendPhoneOTP,
} from "../hooks/useAuth";
import { useCurrentUser } from "../hooks/useAuth";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Full screen layout ── */
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

/* ── Card ── */
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

/* ── Logo ── */
.lp-logo {
    display: inline-flex; align-items: center; gap: 1px;
    font-size: 1.35rem; font-weight: 800; color: #0f172a;
    text-decoration: none; letter-spacing: -0.5px;
    margin-bottom: 30px;
}
.lp-logo em  { color: #16a34a; font-style: normal; }
.lp-logo sup { color: #16a34a; font-size: 1.7rem; line-height: 0; vertical-align: -0.15em; }

/* ── Heading ── */
.lp-h1  { font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 5px; letter-spacing: -0.5px; line-height: 1.2; }
.lp-sub { font-size: 0.82rem; color: #94a3b8; font-weight: 400; margin-bottom: 26px; }

/* ── Alert ── */
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

/* ── Social ── */
.lp-socials { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 18px; }
.lp-soc-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.2s; border: none; }
.lp-soc-btn:active { transform: scale(0.97); }
.lp-soc-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.lp-g { background: #fff; color: #0f172a; border: 1.5px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.lp-g:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
.lp-f { background: #1877F2; color: #fff; box-shadow: 0 3px 10px rgba(24,119,242,0.3); }
.lp-f:hover:not(:disabled) { background: #166FE5; box-shadow: 0 6px 16px rgba(24,119,242,0.38); transform: translateY(-1px); }

/* ── Divider ── */
.lp-div { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; }
.lp-div-line { flex: 1; height: 1.5px; background: #f1f5f9; }
.lp-div-text { font-size: 0.67rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }

/* ── Tabs ── */
.lp-tabs { display: flex; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 3px; gap: 3px; margin-bottom: 18px; }
.lp-tab { flex: 1; padding: 8px; border-radius: 9px; font-size: 0.8rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; border: none; cursor: pointer; transition: all 0.22s; color: #94a3b8; background: transparent; }
.lp-tab.on { background: #0f172a; color: #fff; box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
.lp-tab:not(.on):hover { color: #475569; }

/* ── Inputs ── */
.lp-field { margin-bottom: 10px; }
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
.lp-inp.otp-inp { text-align: center; letter-spacing: 10px; font-size: 1.15rem; font-weight: 700; }

/* ── Phone row ── */
.lp-phone-row { display: flex; gap: 8px; margin-bottom: 10px; }
.lp-phone-row .lp-inp { flex: 1; }
.lp-otp-btn { padding: 0 18px; background: #0f172a; color: #fff; font-size: 0.8rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
.lp-otp-btn:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); }
.lp-otp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.lp-otp-btn.sent { background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; }

/* ── Submit ── */
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

/* ── Footer text ── */
.lp-note    { font-size: 0.74rem; color: #94a3b8; text-align: center; margin-top: 10px; line-height: 1.6; }
.lp-switch  { font-size: 0.8rem; color: #64748b; text-align: center; margin-top: 16px; }
.lp-sw-btn  { background: none; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: inherit; color: #16a34a; font-weight: 700; cursor: pointer; padding: 0; }
.lp-sw-btn:hover { text-decoration: underline; }
.lp-back-btn { background: none; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.74rem; color: #94a3b8; cursor: pointer; display: block; margin: 9px auto 0; transition: color 0.18s; padding: 0; }
.lp-back-btn:hover { color: #64748b; }

/* ── Bottom copyright ── */
.lp-foot { font-size: 0.68rem; color: #94a3b8; text-align: center; padding: 0 0 28px; position: relative; z-index: 1; }

@media (max-width: 520px) {
    .lp-main { padding: 28px 14px; }
    .lp-card { padding: 32px 22px 28px; border-radius: 20px; }
    .lp-h1   { font-size: 1.4rem; }
    .lp-socials { grid-template-columns: 1fr; }
}
`;

const ERR = {
    'auth/invalid-email':             'Invalid email address format.',
    'auth/user-not-found':            'No account found with this email.',
    'auth/wrong-password':            'Incorrect password. Please try again.',
    'auth/email-already-in-use':      'This email is already registered.',
    'auth/weak-password':             'Password must be at least 6 characters.',
    'auth/invalid-credential':        'Invalid email or password.',
    'auth/invalid-phone-number':      'Invalid phone number format.',
    'auth/quota-exceeded':            'SMS quota exceeded. Try again later.',
    'auth/invalid-verification-code': 'Invalid OTP code.',
    'auth/code-expired':              'OTP expired. Please request a new one.',
    'auth/popup-closed-by-user':      'Sign-in popup was closed.',
    'auth/popup-blocked':             'Popup blocked. Please allow popups.',
    'auth/account-exists-with-different-credential': 'Account exists with a different sign-in method.',
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

export default function Login() {
    const navigate = useNavigate();
    const { user } = useCurrentUser();

    const [tab,  setTab]  = useState("email");
    const [mode, setMode] = useState("login");
    const [busy, setBusy] = useState(false);
    const [alrt, setAlrt] = useState(null);

    const [email, setEmail]   = useState("");
    const [pass,  setPass]    = useState("");
    const [name,  setName]    = useState("");
    const [phone, setPhone]   = useState("");
    const [phoneName, setPhoneName] = useState(""); // Phone login এর জন্য নাম
    const [otp,   setOtp]     = useState("");
    const [cfm,   setCfm]     = useState(null);
    const [sent,  setSent]    = useState(false);

    const show  = (type, msg, ttl = null) => setAlrt({ type, message: msg, title: ttl });
    const clear = () => setAlrt(null);

    useEffect(() => {
        if (user) { show('success', 'Redirecting…', 'Welcome back!'); setTimeout(() => navigate("/"), 1200); }
    }, [user, navigate]);
    useEffect(() => { clear(); }, [tab, mode]);

    const doGoogle = async () => {
        clear(); setBusy(true);
        try { await loginWithGoogle(); }
        catch (e) { show('error', getMsg(e)); }
        finally { setBusy(false); }
    };
    const doFacebook = async () => {
        clear(); setBusy(true);
        try { await loginWithFacebook(); }
        catch (e) { show('error', getMsg(e)); }
        finally { setBusy(false); }
    };
    const doEmail = async (e) => {
        e.preventDefault(); clear();
        if (!email || !pass)                    { show('error', 'Please fill in all fields.'); return; }
        if (mode === 'register' && !name.trim()) { show('error', 'Please enter your full name.'); return; }
        if (pass.length < 6)                    { show('error', 'Password must be at least 6 characters.'); return; }
        setBusy(true);
        try {
            if (mode === 'register') {
                await registerWithEmail(email, pass, name);
                show('success', 'Check your inbox to verify your email.', 'Account created!');
                setEmail(""); setPass(""); setName(""); setMode("login");
            } else {
                await loginWithEmail(email, pass);
            }
        } catch (e) { show('error', getMsg(e)); }
        finally { setBusy(false); }
    };
    const doSendOTP = async () => {
        clear();
        if (!phone) { show('error', 'Please enter your phone number.'); return; }
        if (!phone.startsWith('+')) { show('error', 'Phone must start with country code (e.g. +880).'); return; }
        if (!phoneName.trim()) { show('error', 'Please enter your full name.'); return; }
        setBusy(true);
        try {
            setupRecaptcha("recaptcha-container");
            const r = await sendPhoneOTP(phone);
            setCfm(r); setSent(true);
            show('success', 'Enter the 6-digit code sent to your phone.', 'OTP sent!');
        } catch (e) { show('error', getMsg(e)); }
        finally { setBusy(false); }
    };
    const doVerify = async () => {
        clear();
        if (!otp)          { show('error', 'Please enter the OTP code.'); return; }
        if (otp.length !== 6) { show('error', 'OTP must be exactly 6 digits.'); return; }
        setBusy(true);
        try { 
            await cfm.confirm(otp, phoneName); // Name pass করা হচ্ছে
            show('success', 'Phone verified!', 'Verified!'); 
        }
        catch (e) { show('error', getMsg(e)); }
        finally { setBusy(false); }
    };

    const Dots = () => <span className="lp-dots"><span /><span /><span /></span>;

    return (
        <>
            <style>{CSS}</style>
            <div className="lp-page">
                <div className="lp-main">
                    <div className="lp-card">

                        {/* Logo */}
                        <Link to="/" className="lp-logo">
                            <em>Dynamicx</em>Mart<sup>.</sup>
                        </Link>

                        {/* Heading */}
                        <h1 className="lp-h1">{mode === 'login' ? 'Welcome back.' : 'Create account'}</h1>
                        <p className="lp-sub">{mode === 'login' ? 'Sign in to continue shopping' : 'Start your DynamicxMart journey today'}</p>

                        {/* Social */}
                        <div className="lp-socials">
                            <button className="lp-soc-btn lp-g" onClick={doGoogle} disabled={busy} type="button">
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={16} height={16} alt="" />
                                Google
                            </button>
                            <button className="lp-soc-btn lp-f" onClick={doFacebook} disabled={busy} type="button">
                                <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Facebook
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="lp-div">
                            <div className="lp-div-line" />
                            <span className="lp-div-text">or continue with</span>
                            <div className="lp-div-line" />
                        </div>

                        {/* Tabs */}
                        <div className="lp-tabs">
                            {['email', 'phone'].map(t => (
                                <button key={t} className={`lp-tab${tab === t ? ' on' : ''}`} onClick={() => setTab(t)} type="button">
                                    {t === 'email' ? 'Email' : 'Phone OTP'}
                                </button>
                            ))}
                        </div>

                        {/* Email form */}
                        {tab === 'email' && (
                            <form onSubmit={doEmail}>
                                {alrt && <Alert type={alrt.type} title={alrt.title} message={alrt.message} onDismiss={clear} />}
                                {mode === 'register' && (
                                    <div className="lp-field">
                                        <input className="lp-inp" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                )}
                                <div className="lp-field">
                                    <input className="lp-inp" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="lp-field">
                                    <input className="lp-inp" type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
                                </div>
                                <button className="lp-btn" type="submit" disabled={busy}>
                                    {busy ? <Dots /> : mode === 'login' ? 'Sign In' : 'Create Account'}
                                </button>
                                {mode === 'register' && <p className="lp-note">A verification email will be sent to your inbox.</p>}
                                <p className="lp-switch">
                                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                    <button className="lp-sw-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} type="button">
                                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                                    </button>
                                </p>
                            </form>
                        )}

                        {/* Phone form */}
                        {tab === 'phone' && (
                            <div>
                                {alrt && <Alert type={alrt.type} title={alrt.title} message={alrt.message} onDismiss={clear} />}
                                <div id="recaptcha-container" />
                                
                                {/* Name input - শুধু OTP পাঠানোর আগে দেখাবে */}
                                {!sent && (
                                    <div className="lp-field">
                                        <input 
                                            className="lp-inp" 
                                            type="text" 
                                            placeholder="Full name" 
                                            value={phoneName} 
                                            onChange={e => setPhoneName(e.target.value)} 
                                            disabled={busy}
                                        />
                                    </div>
                                )}
                                
                                <div className="lp-phone-row">
                                    <input className="lp-inp" type="tel" placeholder="+8801XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} disabled={sent || busy} />
                                    <button className={`lp-otp-btn${sent ? ' sent' : ''}`} onClick={doSendOTP} disabled={busy || sent} type="button">
                                        {sent ? 'Sent ✓' : 'Send OTP'}
                                    </button>
                                </div>
                                {sent && (
                                    <>
                                        <div className="lp-field">
                                            <input className="lp-inp otp-inp" type="text" placeholder="• • • • • •" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} maxLength={6} />
                                        </div>
                                        <button className="lp-btn" onClick={doVerify} disabled={busy} type="button">
                                            {busy ? <Dots /> : 'Verify & Sign In'}
                                        </button>
                                        <button className="lp-back-btn" onClick={() => { setSent(false); setCfm(null); setOtp(""); setPhoneName(""); clear(); }} type="button">
                                            ← Change number
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <p className="lp-foot">© 2025 DynamicxMart · All rights reserved.</p>
            </div>
        </>
    );
}