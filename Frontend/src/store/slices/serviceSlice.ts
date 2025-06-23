import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Service, ServiceFormData } from "../../types";

interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchServices = createAsyncThunk("services/fetchAll", async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/services", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to fetch services");
  }

  return response.json();
});

export const createService = createAsyncThunk(
  "services/create",
  async (serviceData: ServiceFormData) => {
    const response = await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error("Failed to create service");
    }

    return response.json();
  }
);

export const updateService = createAsyncThunk(
  "services/update",
  async ({ id, data }: { id: string; data: Partial<Service> }) => {
    const response = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update service");
    }

    return response.json();
  }
);

export const deleteService = createAsyncThunk(
  "services/delete",
  async (id: string) => {
    const response = await fetch(`/api/services/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete service");
    }

    return id;
  }
);

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.data.services;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch services";
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload.data.service);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create service";
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(
          (service) => service.id === action.payload.id
        );
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update service";
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(
          (service) => service.id !== action.payload
        );
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete service";
      });
  },
});

export const { clearError } = serviceSlice.actions;
export default serviceSlice.reducer;
