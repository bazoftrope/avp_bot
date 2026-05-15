import { config } from "../config.js";
import { Agent } from "undici";

const agent = new Agent({
  connect: { rejectUnauthorized: false },
});

let sessionCookie = "";

interface FetchInit extends RequestInit {
  dispatcher?: any;
}

async function doLogin(): Promise<void> {
  const url = `${config.xui.baseUrl}/login`;
  const body = new URLSearchParams({
    username: config.xui.username,
    password: config.xui.password,
  });

  const res = await fetch(url, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    dispatcher: agent,
  } as FetchInit);

  if (!res.ok) throw new Error(`Login failed: ${res.status}`);

  const cookie = res.headers.get("set-cookie");
  if (cookie) sessionCookie = cookie.split(";")[0];
}

async function apiRequest(path: string, body?: URLSearchParams): Promise<any> {
  const url = `${config.xui.baseUrl}${path}`;

  // Авторизуемся, если нет cookie
  if (!sessionCookie) {
    await doLogin();
  }

  const headers: Record<string, string> = {
    Cookie: sessionCookie,
  };

  let init: FetchInit = {
    method: "GET",
    headers,
    dispatcher: agent,
  };

  if (body) {
    init = {
      method: "POST",
      body,
      headers: {
        ...headers,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      dispatcher: agent,
    };
  }

  let res = await fetch(url, init);

  // 3X-UI возвращает 404 при отсутствии/протухшей сессии
  if (res.status === 401 || res.status === 403 || res.status === 404) {
    await doLogin();

    // Пересобираем init с новым cookie
    const newHeaders: Record<string, string> = {
      Cookie: sessionCookie,
    };
    init = body
      ? {
          method: "POST",
          body,
          headers: {
            ...newHeaders,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          dispatcher: agent,
        }
      : {
          method: "GET",
          headers: newHeaders,
          dispatcher: agent,
        };

    res = await fetch(url, init);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}

export async function getInbounds() {
  return apiRequest("/panel/api/inbounds/list");
}

export async function getInbound(id: number) {
  return apiRequest(`/panel/api/inbounds/get/${id}`);
}

export async function addClient(inboundId: number, clientSettings: object) {
  const body = new URLSearchParams();
  body.append("id", String(inboundId));
  body.append("settings", JSON.stringify(clientSettings));
  return apiRequest("/panel/api/inbounds/addClient", body);
}
