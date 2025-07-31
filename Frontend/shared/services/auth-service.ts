import axios from "axios";


interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  role: "student" | "writer" | "teacher";
}

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      'http://localhost:8080/auth/login',
      {
        username: credentials.username,
        password: credentials.password,
      }
    )
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      throw new Error(message);
    } else {
      throw new Error("NETWORK_ERROR: Something went wrong.");
    }
  }
}

export async function logoutApi(accessToken: string, refreshToken: string) {
   return axios.post(
    'http://localhost:8080/auth/logout',
    { refreshToken, accessToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

export async function validateAccessTokenApi(accessToken: string, refreshToken: string) {
  return axios.post(
    "http://localhost:8080/auth/validate-access",
    { accessToken, refreshToken },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
}

export async function refreshAccessTokenApi(refreshToken: string, accessToken: string) {
  return axios.post(
    "http://localhost:8080/auth/refresh-access",
    { accessToken, refreshToken },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
}




export async function registerApi(RegisterRequest: RegisterRequest) {
  return axios.post("http://localhost:8080/auth/register", RegisterRequest);
}
