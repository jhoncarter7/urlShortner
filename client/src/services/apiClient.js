import { API_BASE_URL } from "../config";
import axios from "axios";


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, 
  });

  export default apiClient;