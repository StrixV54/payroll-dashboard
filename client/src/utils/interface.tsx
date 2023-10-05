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
  dateofbirth?: string;
  employeeid?: string;
}

export interface UserInfoPersonal {
  currentaddress: string;
  maritialstatus: string;
  workskills: string;
}
export interface UserInfoJob {
  salary: string;
  aadhar: string;
  pancard: string;
  pfaaccount: string;
  datejoined: string;
  manager: string;
}

// export interface UserSalaryAdmin {
//   basic: string;
//   hra: string;
//   pancard: string;
//   pfaaccout: string;
// }

export interface UserInterface {
  lastLoginAt: string;
  displayName: string;
  role: string;
  uid: string;
  email: string;
}

export type RoleLevel = "employee" | "payroll manager" | "super admin";
