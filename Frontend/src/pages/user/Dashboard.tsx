import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchUserAppointments } from "../../store/slices/appointmentSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userAppointments, loading, error } = useAppSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserAppointments(user.id));
    }
  }, [dispatch, user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Onaylandı";
      case "pending":
        return "Beklemede";
      case "cancelled":
        return "İptal Edildi";
      case "completed":
        return "Tamamlandı";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "pending":
        return "⏳";
      case "cancelled":
        return "❌";
      case "completed":
        return "🎉";
      default:
        return "📋";
    }
  };

  const confirmedAppointments = userAppointments.filter(
    (apt) => apt.status === "confirmed"
  );
  const pendingAppointments = userAppointments.filter(
    (apt) => apt.status === "pending"
  );
  const completedAppointments = userAppointments.filter(
    (apt) => apt.status === "completed"
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Hoş geldiniz, <span className="user-name">{user?.name}</span>! 👋
            </h1>
            <p className="welcome-subtitle">
              Randevularınızı yönetin ve yeni randevu alın.
            </p>
          </div>
          <div className="quick-actions">
            <Link
              to="/user/appointment/new"
              className="btn btn-primary btn-large"
            >
              <span className="action-icon">📅</span>
              Yeni Randevu
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <span>📊</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{userAppointments.length}</h3>
              <p className="stat-label">Toplam Randevu</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon confirmed">
              <span>✅</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{confirmedAppointments.length}</h3>
              <p className="stat-label">Onaylanan</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <span>⏳</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{pendingAppointments.length}</h3>
              <p className="stat-label">Bekleyen</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <span>🎉</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{completedAppointments.length}</h3>
              <p className="stat-label">Tamamlanan</p>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="appointments-section">
          <div className="section-header">
            <h2 className="section-title">Randevularım</h2>
            <div className="section-actions">
              <Link to="/user/appointment/new" className="btn btn-primary">
                <span className="action-icon">➕</span>
                Yeni Randevu
              </Link>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Randevularınız yükleniyor...</p>
            </div>
          ) : userAppointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>Henüz randevunuz bulunmuyor</h3>
              <p>
                İlk randevunuzu alarak hizmetlerimizden yararlanmaya başlayın.
              </p>
              <Link
                to="/user/appointment/new"
                className="btn btn-primary btn-large"
              >
                İlk Randevunuzu Alın
              </Link>
            </div>
          ) : (
            <div className="appointments-grid">
              {userAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="service-info">
                      <h4 className="service-name">{appointment.service}</h4>
                      <p className="appointment-date">
                        {new Date(appointment.date).toLocaleDateString(
                          "tr-TR",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="appointment-time">🕐 {appointment.time}</p>
                    </div>
                    <div
                      className={`status-badge ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      <span className="status-icon">
                        {getStatusIcon(appointment.status)}
                      </span>
                      <span className="status-text">
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="appointment-notes">
                      <p>
                        <strong>Notlar:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
