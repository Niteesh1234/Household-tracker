import { apiV1Url } from "../config/environment";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    method: "GET",
  });
}

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function apiRequest<TResponse>(path: string, options: RequestInit): Promise<TResponse> {
  const endpoint = `${apiV1Url}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    let message = fallbackMessage;

    try {
      const errorBody = (await response.json()) as { detail?: string };
      message = errorBody.detail ?? fallbackMessage;
    } catch {
      message = fallbackMessage;
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<TResponse>;
}