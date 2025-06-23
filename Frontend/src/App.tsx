import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AppointmentForm from "./pages/user/AppointmentForm";
import AdminAppointments from "./pages/admin/Appointments";
import AdminServices from "./pages/admin/Services";
import AdminUsers from "./pages/admin/Users";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { getCurrentUser } from "./store/slices/authSlice";
import "./App.css";

function AppContent() {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // If we have a token but no user, try to get the current user
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              isAuthenticated && user?.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Home />
              )
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected user routes */}
          <Route path="user" element={<ProtectedRoute role="user" />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointment/new" element={<AppointmentForm />} />
          </Route>

          {/* Protected admin routes */}
          <Route path="admin" element={<ProtectedRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
