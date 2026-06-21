import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-accent" : "text-white/80 hover:text-white"
    }`;

  return (
    <nav className="bg-primary shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl text-white tracking-tight">
          Prop<span className="text-accent">Space</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>Browse</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>My Listings</NavLink>
              <NavLink to="/listings/new" className={linkClass}>+ List Property</NavLink>
              <NavLink to="/profile" className={linkClass}>
                {user?.avatar
                  ? <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                  : <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                      {user?.username?.[0]?.toUpperCase()}
                    </span>
                }
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Sign in</NavLink>
              <Link
                to="/register"
                className="bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-light px-4 py-4 flex flex-col gap-4 border-t border-white/10">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Browse</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>My Listings</NavLink>
              <NavLink to="/listings/new" className={linkClass} onClick={() => setMenuOpen(false)}>+ List Property</NavLink>
              <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>
              <button onClick={handleLogout} className="text-left text-sm font-medium text-white/80 hover:text-white">Sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Sign in</NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setMenuOpen(false)}>Get started</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
