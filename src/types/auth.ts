import { UUID } from "./common";

export interface AuthResponse {
  token: string;
  jwt: string;
}

export interface JWT {
  exp: number;
  email: string;
  first_name: string;
  last_name: string;
  license_id?: UUID;
  superadmin: boolean;
  sub: UUID;
}
