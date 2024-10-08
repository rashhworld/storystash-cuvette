import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const fetchStoryByIdApi = async (storyId) => {
    try {
        const response = await fetch(`${baseURL}/story`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyId })
        });

        const { status, data, msg } = await response.json();
        return status === 'success' ? data : (toast.error(msg), undefined);
    } catch (error) {
        console.error(error);
    }
};

export const fetchStoryByCatagoryApi = async (category) => {
    try {
        const response = await fetch(`${baseURL}/story/category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category })
        });

        const { status, data, msg } = await response.json();
        return status === 'success' ? data : (toast.error(msg), undefined);
    } catch (error) {
        console.error(error);
    }
};

export const createStoryApi = async (storyData, token, storyId) => {
    try {
        const response = await fetch(`${baseURL}/story/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ storyData, storyId })
        });

        const { status, data, msg } = await response.json();
        return status === 'success' ? toast.success(msg) : toast.error(msg);
    } catch (error) {
        console.error(error);
    }
};

export const updateSlideLikeApi = async (storyId, slideId, like, token) => {
    try {
        const response = await fetch(`${baseURL}/story/slide/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ storyId, slideId, like })
        });

        const { status, data, msg } = await response.json();
        return status === 'success' ? data : (toast.error(msg), undefined);
    } catch (error) {
        console.error(error);
    }
};

export const downloadStoryApi = async (source) => {
    try {
        const response = await fetch(`${baseURL}/story/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source })
        });

        toast.success("Download has started, please wait...")

        const link = document.createElement('a');
        link.href = URL.createObjectURL(await response.blob());
        link.download = source.split('/').pop();
        link.click();
    } catch (error) {
        console.error(error);
    }
};