import axios from "axios";
import ServerUrl from "../constants.js";
import { toast } from "react-toastify";

// Helper function for timeout
function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

// Create an axios instance with base URL
const api = axios.create({
  baseURL: ServerUrl,
});

// Request interceptor to add Authorization header
api.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle session expiration
      toast.error("Session Expired! Please Login Again.", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
      // Clear local storage and redirect to login page
      localStorage.clear();
      await timeout(2000);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API class to handle various API requests
class Api {
  // Register new user
  static async registerUser(data) {
    try {
      const response = await api.post("api/user/register", data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  static async loginUser(data) {
    try {
      const response = await api.post("api/user/login", data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP for user
  static async verifyOtp(data) {
    try {
      const response = await api.post("api/user/verify-otp", data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Send products
  static async sendProducts(data) {
    try {
      const response = await api.post("api/user/send-product", data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Register a new admin
  static async registerAdmin(data) {
    try {
      const response = await api.post("api/cargo/admin/register", data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login admin
  static async loginAdmin(data) {
    try {
      const response = await api.post("api/cargo/admin/login", data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get list of containers for a given admin ID
  static async getContainers(id) {
    try {
      const response = await api.get(`api/cargo/admin/${id}/containers`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Set a new container for the admin
  static async setContainer({ adminId, containerData }) {
    try {
      const response = await api.post(`api/cargo/admin/container`, {
        adminId,
        containerData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Book cargo
  static async bookCargo(data) {
    try {
      const response = await api.post("/api/cargo/booking", data);
      return response;
    } catch (error) {
      throw error;
    }
  }


}

export default Api;
