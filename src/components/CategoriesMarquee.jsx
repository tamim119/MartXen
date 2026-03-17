import { categories } from "../assets/assets";

const CategoriesMarquee = () => {
    return (
        <>
            <style>{`
                .cm-root {
                    overflow: hidden;
                    width: 100%;
                    position: relative;
                    max-width: 80rem;
                    margin: 14px auto 0;
                    user-select: none;
                }

                .cm-fade-left {
                    position: absolute;
                    left: 0; top: 0;
                    height: 100%;
                    width: 64px;
                    z-index: 10;
                    pointer-events: none;
                    background: linear-gradient(to right, #f8fafc, transparent);
                }

                .cm-fade-right {
                    position: absolute;
                    right: 0; top: 0;
                    height: 100%;
                    width: 120px;
                    z-index: 10;
                    pointer-events: none;
                    background: linear-gradient(to left, #f8fafc, transparent);
                }

                .cm-track {
                    display: flex;
                    gap: 10px;
                    min-width: 200%;
                    animation: marqueeScroll 40s linear infinite;
                }

                @media (max-width: 640px) {
                    .cm-track { animation-duration: 18s; }
                }

                @keyframes marqueeScroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .cm-btn {
                    flex-shrink: 0;
                    padding: 7px 18px;
                    background: #f0fdf4;
                    border: 1.5px solid #bbf7d0;
                    border-radius: 100px;
                    color: #15803d;
                    font-size: 0.78rem;
                    font-weight: 600;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    letter-spacing: 0.01em;
                    white-space: nowrap;
                    cursor: default;
                    pointer-events: none;
                    -webkit-tap-highlight-color: transparent;
                    outline: none;
                }
            `}</style>

            <div className="cm-root">
                <div className="cm-fade-left" />
                <div className="cm-track">
                    {[...categories, ...categories, ...categories, ...categories].map((category, index) => (
                        <span key={index} className="cm-btn">
                            {category}
                        </span>
                    ))}
                </div>
                <div className="cm-fade-right" />
            </div>
        </>
    );
};

export default CategoriesMarquee;