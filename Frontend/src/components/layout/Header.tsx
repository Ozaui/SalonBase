import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";

const Header = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            ✂️ SalonBase
          </Link>

          <nav className="nav">
            {(!isAuthenticated || user?.role === "user") && (
              <Link to="/" className="nav-link">
                Ana Sayfa
              </Link>
            )}
            {isAuthenticated && user?.role === "user" && (
              <>
                <Link to="/user/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/user/appointment/new" className="nav-link">
                  Randevu Al
                </Link>
              </>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="nav-link">
                  Admin Panel
                </Link>
                <Link to="/admin/appointments" className="nav-link">
                  Randevular
                </Link>
                <Link to="/admin/services" className="nav-link">
                  Hizmetler
                </Link>
                <Link to="/admin/users" className="nav-link">
                  Kullanıcılar
                </Link>
              </>
            )}
          </nav>

          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-info">
                <span className="welcome-text">Merhaba, {user?.name}</span>
                <button onClick={handleLogout} className="btn btn-danger">
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary">
                  Giriş
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
