type ApiResult<T> = { data: T; ok: boolean; error?: string };

export async function apiPost<T>(
  url: string,
  body?: Record<string, unknown>,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      return { data: data as T, ok: false, error: data.error || "Request failed" };
    }
    return { data: data as T, ok: true };
  } catch {
    return { data: null as T, ok: false, error: "Network error" };
  }
}

export async function apiGet<T>(url: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      return { data: data as T, ok: false, error: data.error || "Request failed" };
    }
    return { data: data as T, ok: true };
  } catch {
    return { data: null as T, ok: false, error: "Network error" };
  }
}
