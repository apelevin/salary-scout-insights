
import { CircleData, RoleData, EmployeeWithRoles } from "@/types";
import { formatSalary } from "@/utils/formatUtils";

/**
 * Calculate the budgets for each circle
 */
export const calculateCircleBudgets = (
  circlesData: CircleData[],
  rolesData: RoleData[],
  employeesWithRoles: EmployeeWithRoles[]
) => {
  const employeesPerCircle = new Map<string, Set<string>>();
  const circleBudgets = new Map<string, number>();
  const currentSalaryBudgets = new Map<string, number>();

  // Clean circle names
  const cleanCirclesData = circlesData.map(circle => ({
    ...circle,
    name: circle.name.replace(/["']/g, '').trim(),
    functionalType: circle.functionalType?.replace(/["']/g, '').trim() || ''
  }));

  // Build map of employees per circle
  rolesData.forEach(role => {
    const cleanCircleName = role.circleName?.replace(/["']/g, '').trim() || '';
    const cleanParticipantName = role.participantName.replace(/["']/g, '').trim();
    
    if (cleanCircleName) {
      if (!employeesPerCircle.has(cleanCircleName)) {
        employeesPerCircle.set(cleanCircleName, new Set());
      }
      
      employeesPerCircle.get(cleanCircleName)?.add(cleanParticipantName);
    }
  });

  // Calculate budgets if employees data is available
  if (employeesWithRoles.length > 0) {
    const employeeMap = new Map<string, EmployeeWithRoles>();
    employeesWithRoles.forEach(emp => {
      const fullName = emp.name.replace(/["']/g, '').trim();
      employeeMap.set(fullName, emp);
    });

    // Calculate budget for each circle
    employeesPerCircle.forEach((employeeSet, circleName) => {
      let totalStandardBudget = 0;
      let totalCurrentBudget = 0;

      employeeSet.forEach(employeeName => {
        const employee = employeeMap.get(employeeName);
        if (employee) {
          const isLeader = rolesData.some(role => {
            const roleCircleName = role.circleName?.replace(/["']/g, '').trim() || '';
            const roleName = role.roleName.toLowerCase();
            return roleCircleName === circleName && 
                   role.participantName.replace(/["']/g, '').trim() === employeeName && 
                   (roleName === "лидер" || roleName.includes("лидер операционного круга"));
          });

          let employeeCircleFTE = 0;
          rolesData.forEach(role => {
            if (role.circleName?.replace(/["']/g, '').trim() === circleName && 
                role.participantName.replace(/["']/g, '').trim() === employeeName && 
                role.fte) {
              employeeCircleFTE += role.fte;
            }
          });

          // Exclude leader roles from budget calculations
          if (!isLeader && employeeCircleFTE > 0) {
            if (employee.standardSalary) {
              totalStandardBudget += employee.standardSalary * employeeCircleFTE;
            }
            
            totalCurrentBudget += employee.salary * employeeCircleFTE;
          }
        }
      });

      circleBudgets.set(circleName, totalStandardBudget);
      currentSalaryBudgets.set(circleName, totalCurrentBudget);
    });
  }

  // Get unique circles excluding specific ones
  const uniqueCircles = Array.from(new Set(cleanCirclesData.map(circle => circle.name)))
    .map(name => cleanCirclesData.find(circle => circle.name === name)!)
    .filter(Boolean)
    .filter(circle => 
      circle.name !== "Офис СЕО" && 
      circle.name !== "Otherside"
    );

  return {
    uniqueCircles,
    circleBudgets,
    currentSalaryBudgets
  };
};

/**
 * Calculate budget difference and return with styling class
 */
export const getBudgetDifference = (standard: number, current: number) => {
  const difference = standard - current;
  
  if (difference > 0) {
    return { 
      value: difference, 
      className: 'text-green-600 font-medium' 
    };
  } else if (difference < 0) {
    return { 
      value: difference, 
      className: 'text-red-600 font-medium' 
    };
  } else {
    return { 
      value: 0, 
      className: 'text-gray-500' 
    };
  }
};

