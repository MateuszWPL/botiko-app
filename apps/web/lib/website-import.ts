import { createClient } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getToken(): Promise<string> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? '';
}

async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string; code?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore
    }
    throw Object.assign(new Error(message), { status: res.status });
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type ImportJobStatus =
  | 'PENDING'
  | 'SCRAPING'
  | 'EXTRACTING'
  | 'READY_FOR_REVIEW'
  | 'CONFIRMING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'CANCELLED';

export interface ImportJob {
  id: string;
  status: ImportJobStatus;
  sourceUrl: string;
  scrapedPages: string[];
  failedPages: string[];
  chunksCreated: number;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
  extractedPayload?: ExtractedPayload | null;
  tokenUsage?: number;
}

export interface ExtractedPayload {
  contact?: {
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  } | null;
  services: Array<{
    name: string;
    description?: string | null;
    price?: string | null;
    sourceUrl?: string | null;
  }>;
  faq: Array<{ question: string; answer: string; sourceUrl?: string | null }>;
  hours?: { raw?: string | null } | null;
  about?: string | null;
}

export interface ConfirmPayload {
  contact?: {
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    selected: boolean;
  } | null;
  services: Array<{
    name: string;
    description?: string | null;
    price?: string | null;
    selected: boolean;
  }>;
  faq: Array<{ question: string; answer: string; selected: boolean }>;
  hours?: { raw?: string | null; selected: boolean } | null;
  about?: { text: string; selected: boolean } | null;
}

// ── API calls ──────────────────────────────────────────────────────────────────

export function startImport(
  botId: string,
  sourceUrl: string,
): Promise<{ jobId: string }> {
  return authFetch(`/api/v1/knowledge/${botId}/import-website`, {
    method: 'POST',
    body: JSON.stringify({ sourceUrl }),
  });
}

export function getImportJob(botId: string, jobId: string): Promise<ImportJob> {
  return authFetch(`/api/v1/knowledge/${botId}/import-jobs/${jobId}`);
}

export function listImportJobs(botId: string): Promise<ImportJob[]> {
  return authFetch(`/api/v1/knowledge/${botId}/import-jobs`);
}

export function confirmImport(
  botId: string,
  jobId: string,
  payload: ConfirmPayload,
): Promise<{ chunksCreated: number }> {
  return authFetch(`/api/v1/knowledge/${botId}/import-jobs/${jobId}/confirm`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function cancelImport(botId: string, jobId: string): Promise<void> {
  return authFetch(`/api/v1/knowledge/${botId}/import-jobs/${jobId}`, {
    method: 'DELETE',
  });
}
