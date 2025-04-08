
export interface Employee {
  id?: string;
  name: string;
  salary: number;
  position?: string;
  department?: string;
  standardSalary?: number;
  [key: string]: any;
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
  fte?: number; // Adding FTE field which may not be present in all data
}
