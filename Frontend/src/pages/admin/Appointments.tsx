import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchAppointments,
  updateAppointment,
} from "../../store/slices/appointmentSlice";
import type { Appointment } from "../../types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { tr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  tr: tr,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Takvimde sadece müşteri adını gösterecek özel event componenti
const CustomEvent = ({ event }: { event: any }) => <span>{event.title}</span>;

const AdminAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments } = useAppSelector((state) => state.appointments);

  // Modal için state
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  // Takvim görünümü için state
  const [calendarView, setCalendarView] = useState("week");
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleStatusChange = async (
    id: string,
    newStatus: Appointment["status"]
  ) => {
    try {
      setStatusLoading(true);
      await dispatch(
        updateAppointment({ id, data: { status: newStatus } })
      ).unwrap();
      await dispatch(fetchAppointments());
      setStatusLoading(false);
      setModalOpen(false);
    } catch (err) {
      setStatusLoading(false);
      console.error("Status update failed:", err);
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

  const events = useMemo(
    () =>
      appointments.map((appointment) => {
        const date = new Date(appointment.date);
        const [hours, minutes] = appointment.time.split(":");
        date.setHours(Number(hours), Number(minutes), 0, 0);
        // Varsayılan olarak 1 saatlik event
        const end = new Date(date.getTime() + 60 * 60 * 1000);
        return {
          id: appointment.id,
          title: appointment.userName,
          start: date,
          end: end,
          resource: appointment,
          allDay: false,
        };
      }),
    [appointments]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="py-8 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Randevu Yönetimi
        </h1>
        <div className="bg-white shadow-md rounded-lg p-4 w-full">
          <div className="overflow-x-auto w-full">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              className="w-full min-w-[700px]"
              defaultView="week"
              views={["month", "week", "day", "agenda"]}
              view={calendarView}
              onView={setCalendarView}
              date={calendarDate}
              onNavigate={setCalendarDate}
              components={{ event: CustomEvent }}
              messages={{
                next: "İleri",
                previous: "Geri",
                today: "Bugün",
                month: "Ay",
                week: "Hafta",
                day: "Gün",
                agenda: "Ajanda",
                date: "Tarih",
                time: "Saat",
                event: "Randevu",
                noEventsInRange: "Bu aralıkta randevu yok.",
              }}
              eventPropGetter={(event: any) => {
                const status = event.resource.status;
                let bg = "#e2e8f0";
                if (status === "confirmed") bg = "#bbf7d0";
                if (status === "pending") bg = "#fef08a";
                if (status === "cancelled") bg = "#fecaca";
                if (status === "completed") bg = "#bfdbfe";
                return { style: { backgroundColor: bg, color: "#222" } };
              }}
              tooltipAccessor={(event: any) =>
                `${event.title}\nDurum: ${getStatusText(event.resource.status)}`
              }
              onSelectEvent={(event: any) => {
                setSelectedEvent(event.resource);
                setModalOpen(true);
              }}
            />
          </div>
        </div>
        {/* Modal */}
        {modalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
              <h2 className="text-xl font-bold mb-4">Randevu Detayı</h2>
              <div className="mb-2">
                <b>Müşteri:</b> {selectedEvent.userName}
              </div>
              <div className="mb-2">
                <b>Telefon:</b> {selectedEvent.userPhone}
              </div>
              <div className="mb-2">
                <b>Hizmet:</b> {selectedEvent.service}
              </div>
              <div className="mb-2">
                <b>Tarih:</b>{" "}
                {new Date(selectedEvent.date).toLocaleDateString("tr-TR")}{" "}
                {selectedEvent.time}
              </div>
              <div className="mb-2">
                <b>Durum:</b> {getStatusText(selectedEvent.status)}
              </div>
              <div className="mb-4">
                <b>Not:</b> {selectedEvent.notes || "-"}
              </div>
              <div className="modern-appointment-btn-group">
                {/* Onayla Butonu */}
                <button
                  className="modern-appointment-btn modern-btn-green"
                  disabled={
                    statusLoading || selectedEvent.status === "confirmed"
                  }
                  onClick={() =>
                    handleStatusChange(selectedEvent.id, "confirmed")
                  }
                >
                  <span className="modern-btn-icon">✔️</span>
                  <span>Onayla</span>
                </button>
                {/* Tamamlandı Butonu */}
                <button
                  className="modern-appointment-btn modern-btn-blue"
                  disabled={
                    statusLoading || selectedEvent.status === "completed"
                  }
                  onClick={() =>
                    handleStatusChange(selectedEvent.id, "completed")
                  }
                >
                  <span className="modern-btn-icon">✅</span>
                  <span>Tamamlandı</span>
                </button>
                {/* İptal Et Butonu */}
                <button
                  className="modern-appointment-btn modern-btn-red"
                  disabled={
                    statusLoading || selectedEvent.status === "cancelled"
                  }
                  onClick={() =>
                    handleStatusChange(selectedEvent.id, "cancelled")
                  }
                >
                  <span className="modern-btn-icon">❌</span>
                  <span>İptal Et</span>
                </button>
                {/* Kapat Butonu */}
                <button
                  className="modern-appointment-btn modern-btn-gray"
                  onClick={() => setModalOpen(false)}
                >
                  <span className="modern-btn-icon">✖️</span>
                  <span>Kapat</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
