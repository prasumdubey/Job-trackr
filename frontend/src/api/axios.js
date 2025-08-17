import axios from 'axios';

export const BASE_URL = "http://localhost:5000/api";

export const getToken = () => localStorage.getItem('accessToken');


// ------------------ AUTH ------------------

// Signup: POST /users
export const signupUser = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, formData);
    return res.data;
  } catch (err) {
    console.error("Signup API error:", err.response?.data || err.message);
    throw err.response?.data || { error: "Signup failed" };
  }
};

// Login: POST /users/login
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, 
      { email, password }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }, 
      }
    );
    console.log("Login response:", res.data);
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      throw err.response.data; // contains success:false and message
    } else {
      throw { error: "Network or server error" };
    }
  }
};





