import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Appointment, AppointmentFormData } from "../../types";

interface AppointmentState {
  appointments: Appointment[];
  userAppointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  userAppointments: [],
  loading: false,
  error: null,
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Async thunks
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async () => {
    const response = await fetch(`${API_BASE}/appointments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }

    return response.json();
  }
);

export const fetchUserAppointments = createAsyncThunk(
  "appointments/fetchUser",
  async (userId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/appointments/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user appointments");
    }

    return response.json();
  }
);

export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (appointmentData: AppointmentFormData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to create appointment");
    }

    return response.json();
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
    const response = await fetch(`${API_BASE}/appointments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update appointment");
    }

    return response.json();
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id: string) => {
    const response = await fetch(`${API_BASE}/appointments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete appointment");
    }

    return id;
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data.appointments;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch appointments";
      })
      // Fetch user appointments
      .addCase(fetchUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.userAppointments = action.payload.data.appointments;
      })
      .addCase(fetchUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch user appointments";
      })
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload.data.appointment);
        state.userAppointments.push(action.payload.data.appointment);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create appointment";
      })
      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (apt) => apt.id === action.payload.id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        const userIndex = state.userAppointments.findIndex(
          (apt) => apt.id === action.payload.id
        );
        if (userIndex !== -1) {
          state.userAppointments[userIndex] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update appointment";
      })
      // Delete appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (apt) => apt.id !== action.payload
        );
        state.userAppointments = state.userAppointments.filter(
          (apt) => apt.id !== action.payload
        );
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete appointment";
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
