import { jwtDecode } from "jwt-decode";
import { UserRole } from "../types/user";



export function decodeAccessToken(token: string): {
  id: string
  username: string
  role: UserRole
} {
  try {
    const decoded = jwtDecode<any>(token)

    return {
      id: decoded.jti || 'unknown',
      username: decoded.sub || 'unknown',
      role: decoded.role.toLowerCase() ,
    }
  } catch (err) {
    console.warn('JWT decode failed:', err)
    return {
      id: 'unknown',
      username: 'unknown',
      role: 'unknown',
    }
  }
}
