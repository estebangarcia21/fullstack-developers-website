import axios from 'axios';

const DEV = 'http://localhost:4000/dev/api';

export const AXIOS_CLIENT = axios.create({
  baseURL: DEV,
});
