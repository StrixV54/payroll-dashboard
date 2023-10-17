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
  dateOfBirth?: string;
  employeeId?: string;
  grade?: string;
  department?: string;
}

export interface UserInfoFirebase {
  email: string;
  role: string;
  displayName: string;
  lastLoginAt: string;
  phoneNumber: string;
  dateOfBirth: string;
  employeeId: string;
  grade: string;
  uid?: string;
  department: string;
}

export interface UserInfoPersonal {
  currentAddress?: string;
  maritialStatus?: string;
  workSkills?: string;
  salary: string;
  aadhar: string;
  pancard: string;
  pfaAccount: string;
  dateJoined: string;
  manager: string;
}

export interface UserInfoSalary {
  basicSalary: string;
  hra: string;
  totalSalary: string;
  taxDeduction: string;
  month: string;
  year: string;
  employeeId: string;
}

export interface UserInterface {
  lastLoginAt: string;
  displayName: string;
  role: string;
  uid: string;
  email: string;
}

export type RoleLevel = "employee" | "payroll manager" | "super admin";
