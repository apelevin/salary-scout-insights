
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
  totalFTE: number;
  normalizedRolesFTE: Map<string, number>;
  standardSalary?: number;
  operationalCircleType?: string; // Added field for storing the operational circle type
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
  circleName?: string; // Adding circle name field
}

export interface CircleData {
  name: string;
  functionalType: string;
}
