import axios from "axios";

export const unsplash = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}`,
  },
});

export const fetchImages = async ({ pageParam = 1 }) => {
  const res = await unsplash.get("/photos", {
    params: { page: pageParam, per_page: 12 },
  });
  return res.data;
};

export const fetchImageById = async (id) => {
  const res = await unsplash.get(`/photos/${id}`);
  return res.data;
};
