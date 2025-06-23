import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createAppointment } from "../../store/slices/appointmentSlice";
import { fetchServices } from "../../store/slices/serviceSlice";
import * as Yup from "yup";

const AppointmentForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useAppSelector((state: any) => state.services);
  const { loading: appointmentLoading, error: appointmentError } =
    useAppSelector((state: any) => state.appointments);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const validationSchema = Yup.object({
    service: Yup.string().required("Lütfen bir hizmet seçin"),
    date: Yup.date()
      .min(new Date(), "Geçmiş bir tarih seçemezsiniz")
      .required("Tarih gereklidir"),
    time: Yup.string().required("Saat seçimi gereklidir"),
    notes: Yup.string().max(500, "Notlar en fazla 500 karakter olabilir"),
  });

  const initialValues = {
    service: "",
    date: "",
    time: "",
    notes: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    try {
      await dispatch(createAppointment(values)).unwrap();
      navigate("/user/dashboard");
    } catch (err) {
      // Error is handled by the slice
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s: any) => s.id === serviceId);
    setSelectedService(service);
  };

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="appointment-card">
          <div className="appointment-header">
            <div className="appointment-logo">
              <span className="logo-icon">📅</span>
              <h1 className="logo-text">Randevu Al</h1>
            </div>
            <h2 className="appointment-title">Yeni Randevu Oluşturun</h2>
            <p className="appointment-subtitle">
              Size en uygun zamanı seçin ve profesyonel hizmetimizden yararlanın
            </p>
          </div>

          {servicesError && (
            <div className="alert alert-error">
              <span className="error-icon">⚠️</span>
              {servicesError}
            </div>
          )}

          {appointmentError && (
            <div className="alert alert-error">
              <span className="error-icon">⚠️</span>
              {appointmentError}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, setFieldValue }) => (
              <Form className="appointment-form">
                <div className="form-group">
                  <label htmlFor="service" className="form-label">
                    <span className="label-icon">💇‍♀️</span>
                    Hizmet Seçin
                  </label>
                  <Field
                    as="select"
                    id="service"
                    name="service"
                    className={`form-select ${
                      touched.service && errors.service
                        ? "form-input-error"
                        : ""
                    }`}
                    onChange={(e: any) => {
                      setFieldValue("service", e.target.value);
                      handleServiceChange(e.target.value);
                    }}
                  >
                    <option value="">Hizmet seçin</option>
                    {services.map((service: any) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.duration} dk)
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="service"
                    component="div"
                    className="error-message"
                  />
                  {selectedService && (
                    <div className="service-info">
                      <div className="service-details">
                        <h4>{selectedService.name}</h4>
                        <p>{selectedService.description}</p>
                        <div className="service-meta">
                          <span className="duration">
                            {selectedService.duration} dakika
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="date" className="form-label">
                    <span className="label-icon">📆</span>
                    Tarih
                  </label>
                  <Field
                    type="date"
                    id="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    className={`form-input ${
                      touched.date && errors.date ? "form-input-error" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time" className="form-label">
                    <span className="label-icon">⏰</span>
                    Saat
                  </label>
                  <Field
                    as="select"
                    id="time"
                    name="time"
                    className={`form-select ${
                      touched.time && errors.time ? "form-input-error" : ""
                    }`}
                  >
                    <option value="">Saat seçin</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="time"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes" className="form-label">
                    <span className="label-icon">📝</span>
                    Notlar (Opsiyonel)
                  </label>
                  <Field
                    as="textarea"
                    id="notes"
                    name="notes"
                    rows={4}
                    className={`form-textarea ${
                      touched.notes && errors.notes ? "form-input-error" : ""
                    }`}
                    placeholder="Özel isteklerinizi, saç rengi tercihlerinizi veya diğer notlarınızı buraya yazabilirsiniz..."
                  />
                  <ErrorMessage
                    name="notes"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="appointment-buttons">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || appointmentLoading || servicesLoading
                    }
                    className="btn btn-primary btn-large appointment-button"
                  >
                    {isSubmitting || appointmentLoading ? (
                      <>
                        <span className="spinner-small"></span>
                        Randevu Oluşturuluyor...
                      </>
                    ) : (
                      "Randevu Oluştur"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/user/dashboard")}
                    className="btn btn-secondary btn-large"
                  >
                    İptal
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="appointment-footer">
            <Link to="/user/dashboard" className="dashboard-link">
              ← Dashboard'a Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
