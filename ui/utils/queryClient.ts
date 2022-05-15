import axios from 'axios';

export const AXIOS_CLIENT = axios.create({
  baseURL: process.env.API_ENDPOINT,
});
