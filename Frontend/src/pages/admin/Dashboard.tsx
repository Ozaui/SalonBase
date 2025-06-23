import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchAppointments } from "../../store/slices/appointmentSlice";
import { fetchServices } from "../../store/slices/serviceSlice";
import { fetchUsers } from "../../store/slices/userSlice";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { appointments, loading: appointmentsLoading } = useAppSelector(
    (state) => state.appointments
  );
  const { users, loading: usersLoading } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchServices());
    dispatch(fetchUsers());
  }, [dispatch]);

  const getStatusCount = (status: string) => {
    return appointments.filter((apt) => apt.status === status).length;
  };

  const getRegularUsers = () => {
    return users.filter((user) => user.role === "user").length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Paneli - Hoş geldiniz, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Salon yönetimi için tüm araçlar burada.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Toplam Randevu
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {appointmentsLoading ? "..." : appointments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {appointmentsLoading ? "..." : getStatusCount("pending")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {appointmentsLoading ? "..." : getStatusCount("confirmed")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Müşteri</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {usersLoading ? "..." : getRegularUsers()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/appointments"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Randevuları Yönet
                </h3>
                <p className="text-gray-600">
                  Tüm randevuları görüntüle ve düzenle
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/services"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💇‍♀️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Hizmetleri Yönet
                </h3>
                <p className="text-gray-600">
                  Hizmetleri ekle, düzenle veya sil
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Kullanıcıları Yönet
                </h3>
                <p className="text-gray-600">Müşteri hesaplarını yönet</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white shadow-md rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Son Randevular
              </h2>
              <Link
                to="/admin/appointments"
                className="text-purple-600 hover:text-purple-700"
              >
                Tümünü Gör →
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            {appointmentsLoading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Yükleniyor...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Henüz randevu bulunmuyor.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hizmet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.slice(0, 5).map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appointment.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString("tr-TR")}{" "}
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.status === "confirmed"
                            ? "Onaylandı"
                            : appointment.status === "pending"
                            ? "Beklemede"
                            : appointment.status === "cancelled"
                            ? "İptal Edildi"
                            : "Tamamlandı"}
                        </span>
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

export default AdminDashboard;
