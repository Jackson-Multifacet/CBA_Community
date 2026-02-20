
import { API_BASE_URL } from '../src/config';

export const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { 'x-auth-token': token || '' }
        });
        if(!res.ok) throw new Error("Network response was not ok");
        return res.json();
    } catch(e) {
        console.error("API Get Error:", e);
        return [];
    }
  },

  post: async (endpoint: string, body: any) => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token || '' 
            },
            body: JSON.stringify(body)
        });
        return res.json();
    } catch(e) {
        console.error("API Post Error:", e);
        return {};
    }
  }
};
