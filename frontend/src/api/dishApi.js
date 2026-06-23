import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Attach auth tokens here if needed in future
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("[API] Request timed out");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    if (!error.response) {
      console.error("[API] Network error — server may be unreachable");
      return Promise.reject(
        new Error("Unable to reach the server. Check your connection.")
      );
    }

    const { status, data } = error.response;
    const message = data?.message || `Request failed with status ${status}`;
    console.error(`[API] ${status}: ${message}`);

    return Promise.reject(new Error(message));
  }
);

/**
 * Fetch all dishes from the backend.
 * @returns {Promise<Array>} List of dish objects
 */
export const fetchAllDishes = async () => {
  const response = await apiClient.get("/dishes");
  return response.data;
};

/**
 * Toggle the published status of a dish by its numeric dishId.
 * @param {number} dishId
 * @returns {Promise<Object>} Updated dish object
 */
export const toggleDishPublish = async (dishId) => {
  const response = await apiClient.patch(`/dishes/${dishId}`);
  return response.data.data;
};

/**
 * Create a new dish
 * @param {Object} dishData { dishName, imageUrl }
 * @returns {Promise<Object>} The created dish
 */
export const createNewDish = async (dishData) => {
  const response = await apiClient.post("/dishes", dishData);
  return response.data.data;
};

export default apiClient;
