
export interface Employee {
  id?: string;
  name: string;
  salary: number;
  position?: string;
  department?: string;
  [key: string]: any;
}

export interface EmployeeWithRoles extends Employee {
  roles: string[];
}

export interface UploadedFile {
  id: string;
  name: string;
  content: string;
  parsed: boolean;
}

export interface RoleData {
  participantName: string;
  roleName: string;
}
