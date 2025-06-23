import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { login, clearError } from "../../store/slices/authSlice";
import * as Yup from "yup";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Geçerli bir email adresi giriniz")
      .required("Email adresi gereklidir"),
    password: Yup.string().required("Şifre gereklidir"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    dispatch(clearError());

    try {
      await dispatch(login(values)).unwrap();
      navigate("/user/dashboard");
    } catch (err) {
      // Error is handled by the slice
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">✂️</span>
              <h1 className="logo-text">SalonBase</h1>
            </div>
            <h2 className="login-title">Giriş Yapın</h2>
            <p className="login-subtitle">
              Hesabınıza giriş yaparak hizmetlerimizden yararlanın
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="login-form">
                {error && (
                  <div className="alert alert-error">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <span className="label-icon">📧</span>
                    Email Adresi
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${
                      touched.email && errors.email ? "form-input-error" : ""
                    }`}
                    placeholder="ornek@email.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <span className="label-icon">🔒</span>
                    Şifre
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className={`form-input ${
                      touched.password && errors.password
                        ? "form-input-error"
                        : ""
                    }`}
                    placeholder="Şifrenizi girin"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="btn btn-primary btn-large login-button"
                >
                  {isSubmitting || loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Giriş Yapılıyor...
                    </>
                  ) : (
                    "Giriş Yap"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="login-footer">
            <p className="register-link-text">
              Hesabınız yok mu?{" "}
              <Link to="/register" className="register-link">
                Hesap Oluşturun
              </Link>
            </p>
            <Link to="/" className="home-link">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
