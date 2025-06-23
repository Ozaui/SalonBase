import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { register, clearError } from "../../store/slices/authSlice";
import * as Yup from "yup";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Ad en az 2 karakter olmalıdır")
      .max(50, "Ad en fazla 50 karakter olabilir")
      .required("Ad Soyad gereklidir"),
    email: Yup.string()
      .email("Geçerli bir email adresi giriniz")
      .required("Email adresi gereklidir"),
    phone: Yup.string().required("Telefon numarası gereklidir"),
    password: Yup.string()
      .min(6, "Şifre en az 6 karakter olmalıdır")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"
      )
      .required("Şifre gereklidir"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
      .required("Şifre tekrarı gereklidir"),
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    dispatch(clearError());

    const { confirmPassword, ...registerData } = values;

    try {
      await dispatch(register(registerData)).unwrap();
      navigate("/user/appointment/new");
    } catch (err) {
      // Error is handled by the slice
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-logo">
              <span className="logo-icon">✂️</span>
              <h1 className="logo-text">SalonBase</h1>
            </div>
            <h2 className="register-title">Hesap Oluşturun</h2>
            <p className="register-subtitle">
              SalonBase'e katılın ve profesyonel hizmetlerimizden yararlanın
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, values, setFieldValue }) => (
              <Form className="register-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <span className="label-icon">👤</span>
                    Ad Soyad
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className={`form-input ${
                      touched.name && errors.name ? "form-input-error" : ""
                    }`}
                    placeholder="Adınız ve soyadınız"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message"
                  />
                </div>

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
                  <label htmlFor="phone" className="form-label">
                    <span className="label-icon">📞</span>
                    Telefon Numarası
                  </label>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-input ${
                      touched.phone && errors.phone ? "form-input-error" : ""
                    }`}
                    placeholder="0555 123 4567"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      // Sadece rakamları al, diğer tüm karakterleri temizle
                      let value = e.target.value.replace(/[^0-9]/g, "");

                      // Maksimum 11 rakam
                      if (value.length > 11) {
                        value = value.slice(0, 11);
                      }

                      // Format: 0xxx xxx xxxx
                      if (value.length >= 1 && value[0] !== "0") {
                        value = "0" + value.slice(0, 10);
                      }

                      // Boşlukları ekle
                      if (value.length >= 4) {
                        value = value.slice(0, 4) + " " + value.slice(4);
                      }
                      if (value.length >= 8) {
                        value = value.slice(0, 8) + " " + value.slice(8);
                      }

                      // Formik'e güncellenmiş değeri set et
                      setFieldValue("phone", value);
                    }}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message"
                  />
                  <div className="input-hint">Örnek format: 0555 123 4567</div>
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
                    placeholder="Güçlü bir şifre oluşturun"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div
                        className={`strength-fill ${
                          values.password.length >= 6 &&
                          /[a-z]/.test(values.password) &&
                          /[A-Z]/.test(values.password) &&
                          /\d/.test(values.password)
                            ? "strong"
                            : values.password.length >= 4
                            ? "medium"
                            : "weak"
                        }`}
                      ></div>
                    </div>
                    <span className="strength-text">
                      {values.password.length >= 6 &&
                      /[a-z]/.test(values.password) &&
                      /[A-Z]/.test(values.password) &&
                      /\d/.test(values.password)
                        ? "Güçlü şifre"
                        : values.password.length >= 4
                        ? "Orta güçte"
                        : "Zayıf şifre"}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <span className="label-icon">🔐</span>
                    Şifre Tekrarı
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-input ${
                      touched.confirmPassword && errors.confirmPassword
                        ? "form-input-error"
                        : ""
                    }`}
                    placeholder="Şifrenizi tekrar girin"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error-message"
                  />
                  {values.confirmPassword &&
                    values.password === values.confirmPassword && (
                      <div className="success-message">
                        <span className="success-icon">✅</span>
                        Şifreler eşleşiyor
                      </div>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="btn btn-primary btn-large register-button"
                >
                  {isSubmitting || loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Kayıt Yapılıyor...
                    </>
                  ) : (
                    "Hesap Oluştur"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="register-footer">
            <p className="login-link-text">
              Zaten hesabınız var mı?{" "}
              <Link to="/login" className="login-link">
                Giriş Yapın
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

export default Register;
