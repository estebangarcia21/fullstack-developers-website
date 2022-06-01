import axios from 'axios';

export const AXIOS_CLIENT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  withCredentials: true,
});
