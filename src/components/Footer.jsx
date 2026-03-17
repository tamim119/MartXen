import { Link } from "react-router-dom";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ft-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff;
    padding: 0 24px;
    margin-top: 80px;
    border-top: 1.5px solid #f1f5f9;
}
.ft-inner { max-width: 1280px; margin: 0 auto; }

/* ── Top ── */
.ft-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 48px;
    padding: 52px 0 44px;
    border-bottom: 1.5px solid #f1f5f9;
}

/* ── Brand ── */
.ft-logo { text-decoration: none; display: inline-block; margin-bottom: 16px; }
.ft-logo-text { font-size: 1.6rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; line-height: 1; }
.ft-logo-g   { color: #16a34a; }
.ft-logo-dot { color: #16a34a; font-size: 2rem; line-height: 0.4; }

.ft-tagline {
    max-width: 300px;
    font-size: 0.8rem;
    color: #94a3b8;
    line-height: 1.7;
    margin: 0 0 20px;
    font-weight: 400;
}

.ft-socials { display: flex; align-items: center; gap: 8px; }
.ft-social {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1.5px solid #f1f5f9;
    background: #f8fafc;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    color: #94a3b8;
    text-decoration: none;
}
.ft-social:hover {
    border-color: #bbf7d0;
    background: #f0fdf4;
    color: #16a34a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22,163,74,0.12);
}

/* ── Cols ── */
.ft-cols { display: flex; gap: 44px; flex-shrink: 0; }
.ft-col-title {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #94a3b8;
    margin: 0 0 14px;
}
.ft-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 9px; }
.ft-col-link {
    display: flex; align-items: center; gap: 7px;
    font-size: 0.8rem; font-weight: 500;
    color: #475569; text-decoration: none;
    transition: color 0.18s;
}
.ft-col-link:hover { color: #16a34a; }
.ft-col-link svg { flex-shrink: 0; opacity: 0.5; }

/* ── Bottom ── */
.ft-bottom {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 0; gap: 10px; flex-wrap: wrap;
}
.ft-copy { font-size: 0.75rem; color: #94a3b8; margin: 0; }
.ft-badge {
    font-size: 0.7rem; font-weight: 600;
    padding: 3px 10px; border-radius: 100px;
    background: #f0fdf4; color: #16a34a;
    border: 1.5px solid #bbf7d0;
}

/* ── Tablet ── */
@media (max-width: 1024px) { .ft-cols { gap: 32px; } }

/* ── Mobile ── */
@media (max-width: 768px) {
    .ft-root { padding: 0 16px; margin-top: 60px; }
    .ft-top {
        flex-direction: column;
        gap: 0;
        padding: 32px 0 0;
        border-bottom: none;
    }

    /* Brand block — compact row on mobile */
    .ft-brand {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20px;
        border-bottom: 1.5px solid #f1f5f9;
        width: 100%;
    }
    .ft-logo { margin-bottom: 0; }
    .ft-logo-text { font-size: 1.25rem; }
    .ft-logo-dot { font-size: 1.6rem; }
    .ft-tagline { display: none; }

    /* Cols → 3 col grid */
    .ft-cols {
        gap: 0;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        padding: 20px 0;
        border-bottom: 1.5px solid #f1f5f9;
    }
    .ft-col-title { font-size: 0.65rem; margin-bottom: 10px; }
    .ft-col-link  { font-size: 0.75rem; gap: 5px; }
    .ft-col ul    { gap: 7px; }

    .ft-bottom { padding: 12px 0; }
    .ft-copy   { font-size: 0.7rem; }
}

@media (max-width: 400px) {
    .ft-cols { grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px 0; }
}
`;

const Footer = () => {

    const MailIcon    = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14.665 4.667L8.671 8.485a1.333 1.333 0 01-1.338 0L1.332 4.667M2.665 2.667h10.667c.736 0 1.333.597 1.333 1.333v8c0 .736-.597 1.333-1.333 1.333H2.665c-.736 0-1.333-.597-1.333-1.333v-8c0-.736.597-1.333 1.333-1.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    const PhoneIcon   = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9.22 11.045a.667.667 0 00.44-.109l.237-.31a1.667 1.667 0 011.333-.627H13.332c.354 0 .693.141.943.391.25.25.39.589.39.943v2c0 .353-.14.692-.39.942-.25.25-.589.39-.943.39-3.183 0-6.235-1.264-8.485-3.514C2.597 8.901 1.332 5.849 1.332 2.666c0-.353.14-.692.39-.942.25-.25.59-.39.943-.39h2c.354 0 .693.14.943.39.25.25.39.589.39.943v2c0 .207-.042.411-.135.597a1.667 1.667 0 01-.364.433l-.312.234a.667.667 0 00-.233.644c.911 1.85 2.41 3.347 4.261 4.255a.667.667 0 00.005.215z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    const MapPinIcon  = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.335 6.666c0 3.329-3.693 6.796-4.933 7.866a.667.667 0 01-.804 0C6.358 13.462 2.665 9.995 2.665 6.666a5.333 5.333 0 0110.667 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.001 8.666a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    const FacebookIcon  = () => (<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 1.667h-2.5a4.167 4.167 0 00-4.167 4.166V8.333H5.833V11.667H8.333V18.333H11.667V11.667H14.167L15 8.333H11.667V5.833a.833.833 0 01.833-.833H15V1.667z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    const InstagramIcon = () => (<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M14.585 5.417h.008M5.835 1.667h8.333a4.167 4.167 0 014.167 4.166v8.334a4.167 4.167 0 01-4.167 4.166H5.835a4.167 4.167 0 01-4.167-4.166V5.833a4.167 4.167 0 014.167-4.166zM13.335 9.475a3.333 3.333 0 11-6.593.859 3.333 3.333 0 016.593-.859z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    const TwitterIcon   = () => (<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M18.335 3.334s-.583 1.75-1.667 2.833C18.001 14.5 8.835 20.584 1.668 15.834c1.833.083 3.667-.5 5-1.667-4.167-1.25-6.25-6.167-4.167-10 1.833 2.167 4.667 3.417 7.5 3.333-.75-3.5 3.333-5.5 5.833-3.166.917 0 2.5-1 2.5-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    const LinkedinIcon  = () => (<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M13.335 6.667a5 5 0 015 5V17.5h-3.333v-5.833a1.667 1.667 0 00-3.334 0V17.5H8.335v-5.833a5 5 0 015-5zM5.001 7.5H1.668V17.5H5.001V7.5zM3.335 5a1.667 1.667 0 100-3.333A1.667 1.667 0 003.335 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)

    const linkSections = [
        {
            title: "Products",
            links: [
                { text: "Earphones",   path: '/shop?category=Earphones' },
                { text: "Headphones",  path: '/shop?category=Headphones' },
                { text: "Smartphones", path: '/shop?category=Smartphones' },
                { text: "Laptops",     path: '/shop?category=Laptops' },
            ]
        },
        {
            title: "Company",
            links: [
                { text: "Home",           path: '/' },
                { text: "Privacy Policy", path: '/' },
                { text: "Plus Member",    path: '/pricing' },
                { text: "Create Store",   path: '/create-store' },
            ]
        },
        {
            title: "Contact",
            links: [
                { text: "+1-212-456-7890",     path: '/', Icon: PhoneIcon },
                { text: "contact@example.com", path: '/', Icon: MailIcon },
                { text: "794 Francisco",        path: '/', Icon: MapPinIcon },
            ]
        }
    ];

    const socials = [
        { Icon: FacebookIcon,  href: "https://facebook.com"  },
        { Icon: InstagramIcon, href: "https://instagram.com" },
        { Icon: TwitterIcon,   href: "https://twitter.com"   },
        { Icon: LinkedinIcon,  href: "https://linkedin.com"  },
    ];

    return (
        <>
            <style>{CSS}</style>
            <footer className="ft-root">
                <div className="ft-inner">
                    <div className="ft-top">

                        {/* Brand */}
                        <div className="ft-brand">
                            <Link to="/" className="ft-logo">
                                <span className="ft-logo-text">
                                    <span className="ft-logo-g">Dynamicx</span>Mart
                                    <span className="ft-logo-dot">.</span>
                                </span>
                            </Link>
                            {/* Social — visible on mobile inside brand row */}
                            <div className="ft-socials">
                                {socials.map(({ Icon, href }, i) => (
                                    <a key={i} href={href} target="_blank" rel="noreferrer" className="ft-social">
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Tagline — hidden on mobile */}
                        <p className="ft-tagline">
                            Your ultimate destination for the latest and smartest gadgets.
                            From smartphones to accessories — all in one place.
                        </p>

                        {/* Link cols */}
                        <div className="ft-cols">
                            {linkSections.map((section, i) => (
                                <div className="ft-col" key={i}>
                                    <p className="ft-col-title">{section.title}</p>
                                    <ul>
                                        {section.links.map(({ text, path, Icon }, j) => (
                                            <li key={j}>
                                                <Link to={path} className="ft-col-link">
                                                    {Icon && <Icon />}
                                                    {text}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Bottom */}
                    <div className="ft-bottom">
                        <p className="ft-copy text-center">© 2025 DynamicxMart. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;