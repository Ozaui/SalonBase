import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../store/slices/serviceSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialForm = {
  name: "",
  description: "",
  duration: "",
  price: "",
  isActive: "true",
};

const ServiceSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Hizmet adı en az 2 karakter olmalı")
    .max(100, "Hizmet adı en fazla 100 karakter olabilir")
    .required("Hizmet adı zorunlu"),
  description: Yup.string()
    .min(10, "Açıklama en az 10 karakter olmalı")
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .required("Açıklama zorunlu"),
  duration: Yup.number()
    .min(5, "Süre en az 5 dakika olmalı")
    .max(480, "Süre en fazla 480 dakika olabilir")
    .required("Süre zorunlu"),
  price: Yup.number().min(0, "Fiyat negatif olamaz").required("Fiyat zorunlu"),
  isActive: Yup.string().oneOf(["true", "false"]),
});

const EditServiceSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Hizmet adı en az 2 karakter olmalı")
    .max(100, "Hizmet adı en fazla 100 karakter olabilir")
    .required("Hizmet adı zorunlu"),
  description: Yup.string()
    .min(10, "Açıklama en az 10 karakter olmalı")
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .required("Açıklama zorunlu"),
  duration: Yup.number()
    .min(5, "Süre en az 5 dakika olmalı")
    .max(480, "Süre en fazla 480 dakika olabilir")
    .required("Süre zorunlu"),
  price: Yup.number().min(0, "Fiyat negatif olamaz").required("Fiyat zorunlu"),
  isActive: Yup.string().oneOf(["true", "false"]),
});

const AdminServices = () => {
  const dispatch = useAppDispatch();
  const { services, loading, error } = useAppSelector(
    (state) => state.services
  );
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [editErrors, setEditErrors] = useState<any>({});
  const [editGeneralError, setEditGeneralError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Hizmet sil
  const handleDelete = async (id: string) => {
    if (window.confirm("Bu hizmeti silmek istediğinize emin misiniz?")) {
      await dispatch(deleteService(id));
    }
  };

  // Inline edit başlat
  const startEdit = (service: any) => {
    setEditId(service.id);
    setEditData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      isActive: service.isActive ? "true" : "false",
    });
  };

  // Inline edit kaydet
  const saveEdit = async (id: string) => {
    // Validasyon
    try {
      await EditServiceSchema.validate(editData, { abortEarly: false });
      setEditErrors({});
      setEditGeneralError(null);
    } catch (err: any) {
      const errors: any = {};
      let firstField: string | undefined = undefined;
      let firstMsg = null;
      if (err.inner) {
        err.inner.forEach((e: any, idx: number) => {
          errors[e.path] = e.message;
          if (idx === 0) {
            firstField = e.path;
            firstMsg = e.message;
          }
        });
      }
      setEditErrors(errors);
      setEditGeneralError(firstMsg);
      // Hatalı inputa odaklan
      setTimeout(() => {
        const el = document.querySelector<HTMLInputElement>(
          `[name='${firstField}']`
        );
        if (el) el.focus();
      }, 0);
      return;
    }
    // isActive string olarak tutuluyor, boolean'a çevir
    const dataToSend = {
      ...editData,
      duration: Number(editData.duration),
      price: Number(editData.price),
      isActive: editData.isActive === "true" || editData.isActive === true,
    };
    const result = await dispatch(updateService({ id, data: dataToSend }));
    console.log("updateService result:", result);
    setEditId(null);
    setEditData({});
  };

  // Inline edit iptal
  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Hizmet Yönetimi
        </h1>

        {/* Hata mesajı */}
        {error && <div className="alert alert-error mb-4">{error}</div>}

        {/* Hizmet Ekleme Formu */}
        <Formik
          initialValues={initialForm}
          validationSchema={ServiceSchema}
          onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
            const submitValues = {
              ...values,
              duration: Number(values.duration),
              price: Number(values.price),
              isActive: values.isActive === "true",
            };
            const result = await dispatch(createService(submitValues));
            if (!result.payload) {
              resetForm();
              setStatus({ general: undefined });
            } else if (typeof result.payload === "string") {
              setStatus({ general: result.payload });
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className="modern-service-form">
              <Field
                name="name"
                placeholder="Hizmet Adı"
                className="modern-input"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="alert alert-error"
              />
              <Field
                name="description"
                placeholder="Açıklama"
                className="modern-input"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="alert alert-error"
              />
              <Field
                name="duration"
                type="number"
                min={5}
                max={480}
                placeholder="Süre (dk)"
                className="modern-input"
              />
              <ErrorMessage
                name="duration"
                component="div"
                className="alert alert-error"
              />
              <Field
                name="price"
                type="number"
                min={0}
                placeholder="Fiyat (₺)"
                className="modern-input"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="alert alert-error"
              />
              <Field as="select" name="isActive" className="modern-input">
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </Field>
              <button
                type="submit"
                className="modern-appointment-btn modern-btn-green"
                style={{ minWidth: 120 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ekleniyor..." : "Ekle"}
              </button>
              {/* Backend error */}
              {status && status.general && (
                <div className="alert alert-error mb-2">{status.general}</div>
              )}
            </Form>
          )}
        </Formik>

        <div className="bg-white shadow-md rounded-lg mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Tüm Hizmetler
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Yükleniyor...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Henüz hizmet bulunmuyor.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 modern-service-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Hizmet Adı</th>
                    <th>Açıklama</th>
                    <th>Süre (dk)</th>
                    <th>Fiyat (₺)</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service: any) => (
                    <tr key={service.id}>
                      <td>
                        {editId === service.id ? (
                          <div>
                            {editGeneralError && (
                              <div className="alert alert-error mb-2">
                                {editGeneralError}
                              </div>
                            )}
                            <input
                              type="text"
                              className="modern-input"
                              name="name"
                              value={editData.name}
                              onChange={(e) =>
                                setEditData((d: any) => ({
                                  ...d,
                                  name: e.target.value,
                                }))
                              }
                            />
                            {editErrors.name && (
                              <div className="alert alert-error">
                                {editErrors.name}
                              </div>
                            )}
                          </div>
                        ) : (
                          service.name
                        )}
                      </td>
                      <td>
                        {editId === service.id ? (
                          <div>
                            <input
                              type="text"
                              className="modern-input"
                              value={editData.description}
                              onChange={(e) =>
                                setEditData((d: any) => ({
                                  ...d,
                                  description: e.target.value,
                                }))
                              }
                            />
                            {editErrors.description && (
                              <div className="alert alert-error">
                                {editErrors.description}
                              </div>
                            )}
                          </div>
                        ) : (
                          service.description
                        )}
                      </td>
                      <td>
                        {editId === service.id ? (
                          <div>
                            <input
                              type="number"
                              min={5}
                              max={480}
                              className="modern-input"
                              value={editData.duration}
                              onChange={(e) =>
                                setEditData((d: any) => ({
                                  ...d,
                                  duration: e.target.value,
                                }))
                              }
                            />
                            {editErrors.duration && (
                              <div className="alert alert-error">
                                {editErrors.duration}
                              </div>
                            )}
                          </div>
                        ) : (
                          service.duration
                        )}
                      </td>
                      <td>
                        {editId === service.id ? (
                          <div>
                            <input
                              type="number"
                              min={0}
                              className="modern-input"
                              value={editData.price}
                              onChange={(e) =>
                                setEditData((d: any) => ({
                                  ...d,
                                  price: e.target.value,
                                }))
                              }
                            />
                            {editErrors.price && (
                              <div className="alert alert-error">
                                {editErrors.price}
                              </div>
                            )}
                          </div>
                        ) : (
                          service.price + "₺"
                        )}
                      </td>
                      <td>
                        {editId === service.id ? (
                          <div>
                            <select
                              className="modern-input"
                              value={editData.isActive}
                              onChange={(e) =>
                                setEditData((d: any) => ({
                                  ...d,
                                  isActive: e.target.value,
                                }))
                              }
                            >
                              <option value="true">Aktif</option>
                              <option value="false">Pasif</option>
                            </select>
                            {editErrors.isActive && (
                              <div className="alert alert-error">
                                {editErrors.isActive}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span
                            className={
                              service.isActive === true ||
                              service.isActive === "true" ||
                              service.isActive === 1
                                ? "modern-badge-active"
                                : "modern-badge-passive"
                            }
                          >
                            {service.isActive === true ||
                            service.isActive === "true" ||
                            service.isActive === 1
                              ? "Aktif"
                              : "Pasif"}
                          </span>
                        )}
                      </td>
                      <td>
                        {editId === service.id ? (
                          <>
                            <button
                              className="modern-appointment-btn modern-btn-blue modern-btn-small"
                              style={{ minWidth: 60, fontSize: 16, padding: 8 }}
                              onClick={() => saveEdit(service.id)}
                              type="button"
                            >
                              Kaydet
                            </button>
                            <button
                              className="modern-appointment-btn modern-btn-gray modern-btn-small"
                              style={{ minWidth: 60, fontSize: 16, padding: 8 }}
                              onClick={cancelEdit}
                              type="button"
                            >
                              İptal
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="modern-appointment-btn modern-btn-blue modern-btn-small"
                              style={{ minWidth: 60, fontSize: 16, padding: 8 }}
                              onClick={() => startEdit(service)}
                              type="button"
                            >
                              Düzenle
                            </button>
                            <button
                              className="modern-appointment-btn modern-btn-red modern-btn-small"
                              style={{ minWidth: 60, fontSize: 16, padding: 8 }}
                              onClick={() => handleDelete(service.id)}
                              type="button"
                            >
                              Sil
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
