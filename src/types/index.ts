
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
  operationalCircleType?: string;
  operationalCircleCount?: number;
  strategicCircleCount?: number;
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
  fte?: number;
  circleName?: string;
}

export interface CircleData {
  name: string;
  functionalType: string;
}

export interface LeadershipData {
  roleName: string;
  standardSalary: number;
  description?: string;
  leadershipType?: string;
  circleCount?: string;
}

export interface LeadershipTableData {
  leadershipType: string;
  circleSalaries: Map<string, number>;
}

// Add a proper Map type definition
export type Map<K, V> = {
  get(key: K): V | undefined;
  set(key: K, value: V): Map<K, V>;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  size: number;
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
}
