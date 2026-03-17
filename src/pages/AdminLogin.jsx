import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFloatingToast } from "../components/FloatingToastProvider";
import { loginWithEmail } from "../hooks/useAuth";
import { getUser } from "../lib/services/userService";
import { auth } from "../lib/firebase";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { showToast } = useFloatingToast();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validation
        if (!email.trim()) {
            showToast("Please enter your email address", "error");
            return;
        }

        if (!password) {
            showToast("Please enter your password", "error");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email address", "error");
            return;
        }

        setLoading(true);

        try {
            const user = await loginWithEmail(email, password);
            
            // Check if user is admin
            const userData = await getUser(user.uid);
            
            if (userData?.role !== "admin") {
                await auth.signOut();
                showToast("Access denied. Admin credentials required", "error");
                return;
            }

            showToast("Welcome back, Admin! 👋", "success");
            navigate("/admin");

        } catch (err) {
            console.error("Admin login error:", err);
            
            // Handle specific Firebase auth errors
            const errorCode = err.code;
            
            if (errorCode === "auth/user-not-found") {
                showToast("No account found with this email", "error");
            } else if (errorCode === "auth/wrong-password") {
                showToast("Incorrect password. Please try again", "error");
            } else if (errorCode === "auth/invalid-email") {
                showToast("Invalid email format", "error");
            } else if (errorCode === "auth/user-disabled") {
                showToast("This account has been disabled", "error");
            } else if (errorCode === "auth/too-many-requests") {
                showToast("Too many failed attempts. Please try again later", "error");
            } else if (errorCode === "auth/network-request-failed") {
                showToast("Network error. Please check your connection", "error");
            } else if (errorCode === "auth/invalid-credential") {
                showToast("Invalid credentials. Please check your email and password", "error");
            } else {
                showToast(err.message || "Login failed. Please try again", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-slate-900 p-14">
                <Link to="/" className="text-4xl font-semibold text-white">
                    <span className="text-green-500">go</span>cart
                    <span className="text-green-500 text-5xl leading-0">.</span>
                </Link>
                <div>
                    <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        Admin Portal
                    </div>
                    <h2 className="text-4xl font-medium text-white leading-snug max-w-sm">
                        Manage your<br />
                        <span className="text-green-400">GoCart store.</span>
                    </h2>
                    <p className="text-slate-400 mt-4 text-sm max-w-xs leading-relaxed">
                        Access the admin dashboard to manage products, orders, stores and coupons.
                    </p>
                </div>
                <p className="text-slate-600 text-xs">© 2025 GoCart Admin Panel</p>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-sm">

                    {/* Mobile logo */}
                    <Link to="/" className="lg:hidden block text-3xl font-semibold text-slate-700 mb-8">
                        <span className="text-green-600">go</span>cart
                        <span className="text-green-600 text-4xl leading-0">.</span>
                    </Link>

                    {/* Admin badge */}
                    <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-medium mb-6">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Admin Access Only
                    </div>

                    <h1 className="text-2xl font-semibold text-slate-800 mb-1">Admin Sign In</h1>
                    <p className="text-slate-400 text-sm mb-8">Enter your admin credentials</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="admin@gocart.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-black active:scale-[0.98] transition disabled:opacity-50 mt-1"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : "Sign In to Dashboard"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 transition flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back to store
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;