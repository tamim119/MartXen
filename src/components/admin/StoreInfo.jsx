import { MapPinIcon, MailIcon, PhoneIcon, CalendarIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.si-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
}

/* ── Logo ── */
.si-logo {
    width: 52px; height: 52px;
    border-radius: 14px;
    object-fit: cover;
    border: 1.5px solid #f1f5f9;
    background: #f8fafc;
}

/* ── Header row ── */
.si-header {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}
.si-name {
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.2px;
}
.si-username {
    font-size: 0.775rem;
    color: #94a3b8;
    font-weight: 500;
}
.si-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 100px;
    padding: 3px 10px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.3px;
}
.si-status.pending  { background: #fefce8; border: 1.5px solid #fde68a; color: #854d0e; }
.si-status.approved { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #15803d; }
.si-status.rejected { background: #fef2f2; border: 1.5px solid #fecaca; color: #b91c1c; }
.si-status-dot { width: 5px; height: 5px; border-radius: 50%; }
.si-status.pending  .si-status-dot { background: #f59e0b; }
.si-status.approved .si-status-dot { background: #16a34a; box-shadow: 0 0 4px rgba(22,163,74,0.5); }
.si-status.rejected .si-status-dot { background: #ef4444; }

/* ── Description ── */
.si-desc {
    font-size: 0.82rem;
    color: #64748b;
    line-height: 1.65;
    max-width: 520px;
    font-weight: 400;
}

/* ── Meta info ── */
.si-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
}
.si-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.775rem;
    color: #64748b;
    font-weight: 500;
}
.si-meta-item svg { color: #94a3b8; flex-shrink: 0; }

/* ── Applied by ── */
.si-applied {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 14px;
    width: fit-content;
    margin-top: 2px;
}
.si-applied-label {
    font-size: 0.68rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 1px;
}
.si-user-img {
    width: 32px; height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid #e2e8f0;
    flex-shrink: 0;
}
.si-user-name {
    font-size: 0.8rem;
    font-weight: 700;
    color: #0f172a;
}
.si-user-email {
    font-size: 0.72rem;
    color: #94a3b8;
    font-weight: 400;
}
.si-date {
    font-size: 0.72rem;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
}
`;

const StoreInfo = ({ store }) => {
    const formatDate = (val) => {
        try {
            const d = val?.toDate ? val.toDate() : new Date(val);
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch { return '—'; }
    };

    const statusClass = store.status === 'pending'
        ? 'pending' : store.status === 'rejected'
        ? 'rejected' : 'approved';

    return (
        <>
            <style>{CSS}</style>
            <div className="si-root">

                <img src={store.logo} alt={store.name} className="si-logo" />

                {/* Header */}
                <div className="si-header">
                    <h3 className="si-name">{store.name}</h3>
                    <span className="si-username">@{store.username}</span>
                    <span className={`si-status ${statusClass}`}>
                        <span className="si-status-dot" />
                        {store.status}
                    </span>
                </div>

                {/* Description */}
                {store.description && (
                    <p className="si-desc">{store.description}</p>
                )}

                {/* Meta */}
                <div className="si-meta">
                    {store.address && (
                        <span className="si-meta-item">
                            <MapPinIcon size={13} /> {store.address}
                        </span>
                    )}
                    {store.contact && (
                        <span className="si-meta-item">
                            <PhoneIcon size={13} /> {store.contact}
                        </span>
                    )}
                    {store.email && (
                        <span className="si-meta-item">
                            <MailIcon size={13} /> {store.email}
                        </span>
                    )}
                </div>

                {/* Applied by */}
                {store.user && (
                    <div className="si-applied">
                        <img
                            src={store.user.image || '/default-avatar.png'}
                            alt={store.user.name}
                            className="si-user-img"
                        />
                        <div>
                            <p className="si-applied-label">Applied by</p>
                            <p className="si-user-name">{store.user.name}</p>
                            <p className="si-user-email">{store.user.email}</p>
                        </div>
                        {store.createdAt && (
                            <span className="si-date">
                                <CalendarIcon size={11} />
                                {formatDate(store.createdAt)}
                            </span>
                        )}
                    </div>
                )}

            </div>
        </>
    );
};

export default StoreInfo;