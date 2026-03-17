import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.title-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

/* ── Left ── */
.title-left { display: flex; flex-direction: column; gap: 6px; }

.title-eyebrow {
    display: flex;
    align-items: center;
    gap: 7px;
}
.title-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.15);
    flex-shrink: 0;
}
.title-line {
    height: 1.5px; width: 36px;
    background: linear-gradient(90deg, #16a34a 0%, #4ade80 60%, transparent 100%);
    border-radius: 2px;
    flex-shrink: 0;
}
.title-eyebrow-text {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #16a34a;
}

.title-h2 {
    font-size: clamp(1.35rem, 2.5vw, 1.75rem);
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0;
}
.title-h2 .title-highlight {
    color: #16a34a;
    position: relative;
    display: inline-block;
}
.title-h2 .title-highlight::after {
    content: '';
    position: absolute;
    bottom: 0px;
    left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #16a34a, #4ade80);
    border-radius: 2px;
    opacity: 0.35;
    transform: scaleX(0.85);
    transform-origin: left;
}

.title-desc {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 400;
    margin: 0;
    line-height: 1.55;
    max-width: 360px;
}

/* ── Button ── */
.title-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #16a34a;
    text-decoration: none;
    padding: 9px 18px;
    border-radius: 100px;
    border: 1.5px solid #bbf7d0;
    background: #f0fdf4;
    white-space: nowrap;
    flex-shrink: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    letter-spacing: 0.01em;
}
.title-btn:hover {
    background: #16a34a;
    border-color: #16a34a;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(22,163,74,0.28);
}
.title-btn:hover .title-arr { transform: translateX(4px); }
.title-arr { transition: transform 0.22s cubic-bezier(0.4,0,0.2,1); flex-shrink: 0; }

@media (max-width: 480px) {
    .title-root { flex-direction: column; align-items: flex-start; gap: 12px; }
    .title-btn { align-self: flex-start; }
}
`;

const Title = ({ title, description, visibleButton = true, href = '' }) => {
    const words = title?.trim().split(' ') || [];
    const last  = words.pop();
    const rest  = words.join(' ');

    return (
        <>
            <style>{CSS}</style>
            <div className="title-root">
                <div className="title-left">

                    {/* Eyebrow */}
                    <div className="title-eyebrow">
                        <span className="title-dot" />
                        <span className="title-line" />
                        {description && (
                            <span className="title-eyebrow-text">Featured</span>
                        )}
                    </div>

                    {/* Heading */}
                    <h2 className="title-h2">
                        {rest && <>{rest} </>}
                        <span className="title-highlight">{last}</span>
                    </h2>

                    {/* Description */}
                    {description && (
                        <p className="title-desc">{description}</p>
                    )}

                </div>

                {/* Button */}
                {visibleButton && href && (
                    <Link to={href} className="title-btn">
                        View more
                        <ArrowRight size={13} className="title-arr" />
                    </Link>
                )}
            </div>
        </>
    );
};

export default Title;