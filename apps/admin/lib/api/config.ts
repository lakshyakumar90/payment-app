const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const BASE_URL = raw.replace(/\/$/, "");

export const API_V1_URL = `${BASE_URL}/api/v1`;