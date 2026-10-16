const TOKEN_KEY = "token";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Pembungkus fetch ke REST API Delcom.
 * Mengembalikan JSON respons ({ status, message, data }).
 * Respons dianggap berhasil bila status bernilai "success".
 */
export async function request(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) {
    payload = form;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${DELCOM_BASEURL}${path}`, {
      method,
      headers,
      body: payload,
    });
    return await response.json();
  } catch {
    return { status: "error", message: "Tidak dapat terhubung ke server" };
  }
}

export const isSuccess = (response) => response.status === "success";
