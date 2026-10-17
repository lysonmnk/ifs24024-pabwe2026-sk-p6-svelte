const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function putAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Pembungkus fetch ke Delcom Open API.
 * Selalu mengembalikan objek JSON { status, message, data }.
 * Kegagalan jaringan / respons non-JSON diubah menjadi { status: "fail" }.
 */
export async function apiRequest(
  path,
  { method = "GET", body, formData, auth = true } = {}
) {
  const headers = { Accept: "application/json" };
  const token = getAccessToken();

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let payload;
  if (formData) {
    payload = formData;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${DELCOM_API_URL}${path}`, {
      method,
      headers,
      body: payload,
    });
    return await response.json();
  } catch {
    return { status: "fail", message: "Gagal terhubung ke server" };
  }
}

/** Gabungkan pesan utama dengan detail validasi per field (bila ada). */
export function getErrorMessage(res) {
  const details = Object.values(res.data ?? {})
    .flat()
    .join("\n");
  return details ? `${res.message}\n${details}` : res.message;
}
