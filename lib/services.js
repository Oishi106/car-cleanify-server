import { apiFetch } from './api';

// ─────────────────────────────────
// সব services / products fetch
// ─────────────────────────────────

// সব services — filter, search, pagination সহ
export const getProducts = (params = {}, session = null) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/products?${query}`, {}, session);
};

// Popular services
export const getPopularProducts = (session = null) => {
  return apiFetch('/api/products/popular', {}, session);
};

// Single service — id বা slug দিয়ে
export const getProduct = (idOrSlug, session = null) => {
  return apiFetch(`/api/products/${idOrSlug}`, {}, session);
};

// Duration filter — max minutes
export const getProductsByDuration = (maxMinutes, session = null) => {
  return apiFetch(`/api/products/filter/duration?max=${maxMinutes}`, {}, session);
};

// Price range filter
export const getProductsByPrice = (min, max, session = null) => {
  return apiFetch(`/api/products?minPrice=${min}&maxPrice=${max}`, {}, session);
};

// Review submit
export const submitReview = (productId, reviewData, session) => {
  return apiFetch(
    `/api/products/${productId}/reviews`,
    { method: 'POST', body: JSON.stringify(reviewData) },
    session
  );
};

// ─────────────────────────────────
// Admin only
// ─────────────────────────────────

export const createProduct = (data, session) => {
  return apiFetch(
    '/api/products',
    { method: 'POST', body: JSON.stringify(data) },
    session
  );
};

export const updateProduct = (id, data, session) => {
  return apiFetch(
    `/api/products/${id}`,
    { method: 'PUT', body: JSON.stringify(data) },
    session
  );
};

export const deleteProduct = (id, session) => {
  return apiFetch(
    `/api/products/${id}`,
    { method: 'DELETE' },
    session
  );
};