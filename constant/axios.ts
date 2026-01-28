import axios from 'axios';

// สร้างตัวแปร axios กลาง
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_API_URL || '', 
  timeout: 10000, // ถ้าเกิน 10 วิ ให้ตัด error
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;