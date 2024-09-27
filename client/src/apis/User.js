import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const userLoginApi = async (userData) => {
    try {
        const response = await fetch(`${baseURL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const { status, token, msg } = await response.json();
        return status === 'success' ? token : (toast.error(msg), undefined);
    } catch (error) {
        console.error(error);
    }
};

export const userRegisterApi = async (userData) => {
    try {
        const response = await fetch(`${baseURL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const { status, token, msg } = await response.json();
        return status === 'success' ? (toast.success(msg), token) : (toast.error(msg), undefined);
    } catch (error) {
        console.error(error);
    }
};

export const fetchUserApi = async (token) => {
    try {
        const response = await fetch(`${baseURL}/user`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const { status, data, msg } = await response.json();
        if (status === 'success') {
            return data;
        } else {
            if (status === 'jwtError') throw new Error('JWT Error');
            toast.error(msg);
        }
    } catch (error) {
        console.error(error);
    }
};


export const fetchUserStoryApi = async (token) => {
    try {
        const response = await fetch(`${baseURL}/user/story`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const { status, data, msg } = await response.json();
        return status === 'success' ? data : (toast.error(msg), undefined);
    } catch (error) {
        console.error(error);
    }
};

export const saveUserActionApi = async (storyId, userAction, token) => {
    try {
        const response = await fetch(`${baseURL}/user/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ storyId, userAction }),
        });

        const { status, data, msg } = await response.json();
        return status === 'success' ? data : (toast.error(msg), undefined);
    } catch (error) {
        console.error(error);
    }
};

export const fetchUserActionApi = async (storyId, token) => {
    try {
        const response = await fetch(`${baseURL}/user/action/${storyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const { status, data, msg } = await response.json();
        return status === 'success' ? data : (toast.error(msg), undefined);
    } catch (error) {
        console.error(error);
    }
};