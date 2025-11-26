import axios from "axios";

export const api = axios.create({
  // baseURL: 'https://crm-backend-zejx.onrender.com'
  baseURL: 'http://localhost:3000'
});