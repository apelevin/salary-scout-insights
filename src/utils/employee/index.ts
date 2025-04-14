
// Main export file for employee utilities
// Re-exports all the employee utility functions

export { processEmployeesWithRoles } from "./processingUtils";
export { findCircleLeadershipInfo } from "./leadershipUtils";
export { formatName, formatSalary } from "../formatUtils";
export { calculateStandardSalary, getSalaryDifference } from "../salary";
export { calculateTotalFTE, normalizeRolesFTE } from "../fteUtils";

// These functions are kept for backwards compatibility but are no longer used directly
export { findOperationalCircleInfo, findStrategicCircleCount } from "./leadershipUtils";

