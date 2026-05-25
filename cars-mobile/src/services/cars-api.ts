import type { AdsResponse, DashboardResponse } from '@/types/ad';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error('Unable to load cars. Check that cars-web is running.');
  }

  return response.json() as Promise<T>;
}

export function getDashboardAds(): Promise<DashboardResponse> {
  return fetchJson<DashboardResponse>('/api/mobile/dashboard');
}

export function getAds({
  name,
  model,
  year,
  page,
}: {
  name: string;
  model: string;
  year: string;
  page: number;
}): Promise<AdsResponse> {
  const params = new URLSearchParams();

  if (name.trim()) {
    params.set('name', name.trim());
  }
  if (model.trim()) {
    params.set('model', model.trim());
  }
  if (year.trim()) {
    params.set('year', year.trim());
  }
  params.set('page', String(page));

  return fetchJson<AdsResponse>(`/api/mobile/ads?${params.toString()}`);
}
