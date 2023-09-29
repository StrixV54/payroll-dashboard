export interface FirebaseAPIError {
  code: string;
  message: string;
}

export interface UserInfoLogin {
  email: string;
  password: string;
  first?: string;
  last?: string;
  phoneNumber?: string;
}

export interface UserInterface {
  lastLoginAt: string;
  displayName: string;
  role: string;
  uid: string;
  email: string;
}

export type RoleLevel = "user" | "admin" | "super";
