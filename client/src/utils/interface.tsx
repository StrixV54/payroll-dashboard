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
