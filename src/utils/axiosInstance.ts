import axios from "axios";
import { createClient } from "@/utils/supabase/component"; // Your Supabase client setup

// Ensure that the base URL is taken from the environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Initialize Supabase
const supabase = createClient();

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to attach the token from Supabase
axiosInstance.interceptors.request.use(
  async function (config) {
    // Fetch the Supabase session to get the token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
