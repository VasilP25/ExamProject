import type { AdsResponse, DashboardResponse } from '@/types/ad';
import Constants from 'expo-constants';

function getApiBaseUrl(): string | null {
  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];

  if (expoHost) {
    return `http://${expoHost}:3000`;
  }

  return 'http://localhost:3000';
}

const API_BASE_URL = getApiBaseUrl();

async function fetchJson<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      'Missing API URL. Set EXPO_PUBLIC_API_BASE_URL on the mobile Netlify site to your cars-web URL.',
    );
  }

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
