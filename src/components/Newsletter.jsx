import { useState } from 'react';
import { MailIcon, CheckIcon } from 'lucide-react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.nl-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 0 24px;
    margin: 80px auto;
    max-width: 1280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: nl-fadeUp 0.65s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes nl-fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ── Header ── */
.nl-head {
    text-align: center;
    max-width: 460px;
    margin-bottom: 36px;
    animation: nl-fadeUp 0.55s 0.08s cubic-bezier(0.4,0,0.2,1) both;
}
.nl-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 100px;
    padding: 4px 13px;
    font-size: 0.72rem;
    font-weight: 700;
    color: #16a34a;
    letter-spacing: 0.4px;
    margin-bottom: 14px;
}
.nl-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #16a34a;
    box-shadow: 0 0 5px rgba(22,163,74,0.5);
}
.nl-h2 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
    margin: 0 0 10px;
    line-height: 1.2;
}
.nl-h2 span { color: #16a34a; }
.nl-desc {
    font-size: 0.85rem;
    color: #94a3b8;
    line-height: 1.7;
    margin: 0;
    font-weight: 400;
}

/* ── Card ── */
.nl-card {
    width: 100%;
    max-width: 540px;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 24px;
    padding: 32px 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    position: relative;
    overflow: hidden;
    animation: nl-fadeUp 0.55s 0.16s cubic-bezier(0.4,0,0.2,1) both;
    transition: box-shadow 0.25s;
}
.nl-card:hover {
    box-shadow: 0 12px 36px rgba(22,163,74,0.1);
}

/* blobs */
.nl-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
}
.nl-blob1 {
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(187,247,208,0.7) 0%, transparent 70%);
    top: -60px; right: -40px;
}
.nl-blob2 {
    width: 130px; height: 130px;
    background: radial-gradient(circle, rgba(134,239,172,0.5) 0%, transparent 70%);
    bottom: -45px; left: -25px;
}

/* ── Icon ── */
.nl-icon {
    width: 48px; height: 48px;
    border-radius: 16px;
    background: #fff;
    border: 1.5px solid #bbf7d0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #16a34a;
    position: relative;
    z-index: 1;
    margin-bottom: 2px;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.nl-card:hover .nl-icon { transform: scale(1.08) rotate(-4deg); }

/* ── Form ── */
.nl-form {
    display: flex;
    width: 100%;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 100px;
    padding: 5px 5px 5px 18px;
    gap: 8px;
    position: relative;
    z-index: 1;
    transition: border-color 0.22s, box-shadow 0.22s;
}
.nl-form:focus-within {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
}
.nl-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.85rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a;
    background: transparent;
    min-width: 0;
    font-weight: 500;
}
.nl-input::placeholder { color: #cbd5e1; font-weight: 400; }

.nl-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 11px 22px;
    background: #16a34a;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}
.nl-btn:hover:not(.success) {
    background: #15803d;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(22,163,74,0.38);
}
.nl-btn:active { transform: scale(0.97); }
.nl-btn.success {
    background: #0f172a;
    box-shadow: 0 4px 14px rgba(15,23,42,0.18);
    pointer-events: none;
    animation: nl-successIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes nl-successIn {
    from { transform: scale(0.9); }
    to   { transform: scale(1); }
}

/* ── Hint ── */
.nl-hint {
    font-size: 0.75rem;
    color: #64748b;
    margin: 0;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 400;
}
.nl-hint-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #16a34a;
    flex-shrink: 0;
}
.nl-hint b { color: #16a34a; font-weight: 700; }

/* ── Responsive ── */
@media (max-width: 768px) {
    .nl-root { padding: 0 18px; margin: 56px auto; }
    .nl-card { padding: 24px 20px 18px; border-radius: 20px; }
    .nl-h2   { font-size: 1.5rem; }
}
@media (max-width: 480px) {
    .nl-root { padding: 0 12px; margin: 40px auto; }
    .nl-card { padding: 20px 14px 16px; border-radius: 18px; }
    .nl-form {
        flex-direction: column;
        border-radius: 16px;
        padding: 12px 14px;
        gap: 10px;
    }
    .nl-btn  { width: 100%; border-radius: 12px; padding: 13px; justify-content: center; }
    .nl-icon { display: none; }
}
`;

const Newsletter = () => {
    const [email,   setEmail]   = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 3500);
    };

    return (
        <>
            <style>{CSS}</style>
            <div className='nl-root'>

                {/* Header */}
                <div className='nl-head'>
                    <div className='nl-eyebrow'>
                        <span className='nl-eyebrow-dot' />
                        Stay in the loop
                    </div>
                    <h2 className='nl-h2'>
                        Join our <span>Newsletter</span>
                    </h2>
                    <p className='nl-desc'>
                        Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week.
                    </p>
                </div>

                {/* Card */}
                <div className='nl-card'>
                    <div className='nl-blob nl-blob1' />
                    <div className='nl-blob nl-blob2' />

                    {/* Icon */}
                    <div className='nl-icon'>
                        <MailIcon size={22} strokeWidth={1.8} />
                    </div>

                    {/* Form */}
                    <form className='nl-form' onSubmit={handleSubmit}>
                        <input
                            className='nl-input'
                            type='email'
                            placeholder='Enter your email address'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={success}
                        />
                        <button
                            className={`nl-btn${success ? ' success' : ''}`}
                            type='submit'
                        >
                            {success
                                ? <><CheckIcon size={14} strokeWidth={2.5} /> Subscribed!</>
                                : 'Get Updates'
                            }
                        </button>
                    </form>

                    {/* Hint */}
                    <p className='nl-hint'>
                        <span className='nl-hint-dot' />
                        No spam ever. <b>Unsubscribe</b> anytime.
                    </p>
                </div>

            </div>
        </>
    );
};

export default Newsletter;