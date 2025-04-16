
import { supabase } from "@/integrations/supabase/client";
import { Employee, RoleData, CircleData, LeadershipData } from "@/types";
import { toast } from "@/components/ui/use-toast";

/**
 * Save employees data to Supabase
 */
export const saveEmployeesToSupabase = async (employees: Employee[]): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .upsert(
        employees.map(emp => ({
          name: emp.name,
          salary: emp.salary,
        })),
        { onConflict: 'name' }
      );
    
    if (error) {
      console.error("Error saving employees:", error);
      toast({
        title: "Ошибка сохранения сотрудников",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    console.log("Employees saved successfully:", employees.length);
    return true;
  } catch (error) {
    console.error("Error in saveEmployeesToSupabase:", error);
    toast({
      title: "Ошибка сохранения сотрудников",
      description: "Произошла ошибка при сохранении данных сотрудников",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Save circles data to Supabase
 */
export const saveCirclesToSupabase = async (circles: CircleData[]): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('circles')
      .upsert(
        circles.map(circle => ({
          name: circle.name,
          functional_type: circle.functionalType,
        })),
        { onConflict: 'name' }
      );
    
    if (error) {
      console.error("Error saving circles:", error);
      toast({
        title: "Ошибка сохранения кругов",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    console.log("Circles saved successfully:", circles.length);
    return true;
  } catch (error) {
    console.error("Error in saveCirclesToSupabase:", error);
    toast({
      title: "Ошибка сохранения кругов",
      description: "Произошла ошибка при сохранении данных кругов",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Save roles data to Supabase and create employee_roles associations
 */
export const saveRolesToSupabase = async (
  roles: RoleData[], 
  leadershipData?: LeadershipData[]
): Promise<boolean> => {
  try {
    // First save unique roles to the roles table
    const uniqueRoleNames = [...new Set(roles.map(role => role.roleName))];
    
    // Save standard salary from leadership data if available
    const rolesToSave = uniqueRoleNames.map(roleName => {
      const leadershipEntry = leadershipData?.find(ld => ld.roleName === roleName);
      return {
        name: roleName,
        standard_salary: leadershipEntry?.standardSalary || null,
      };
    });
    
    const { error: rolesError } = await supabase
      .from('roles')
      .upsert(rolesToSave, { onConflict: 'name' });
    
    if (rolesError) {
      console.error("Error saving roles:", rolesError);
      toast({
        title: "Ошибка сохранения ролей",
        description: rolesError.message,
        variant: "destructive",
      });
      return false;
    }
    
    // Now we need to get all employees and circles to create associations
    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .select('id, name');
      
    if (employeesError) {
      console.error("Error fetching employees for role associations:", employeesError);
      return false;
    }
    
    const { data: circlesData, error: circlesError } = await supabase
      .from('circles')
      .select('id, name');
      
    if (circlesError) {
      console.error("Error fetching circles for role associations:", circlesError);
      return false;
    }
    
    // Create a map of names to IDs for easy lookup
    const employeeNameToId = Object.fromEntries(
      employeesData?.map(emp => [emp.name, emp.id]) || []
    );
    
    const circleNameToId = Object.fromEntries(
      circlesData?.map(circle => [circle.name, circle.id]) || []
    );
    
    // Create employee_roles entries
    const employeeRoles = roles
      .filter(role => 
        // Filter out roles where we don't have the employee
        employeeNameToId[role.participantName]
      )
      .map(role => ({
        employee_id: employeeNameToId[role.participantName],
        role_name: role.roleName,
        fte: role.fte || 1.0,
      }));
    
    if (employeeRoles.length > 0) {
      // Delete existing entries and insert new ones
      const { error: deleteError } = await supabase
        .from('employee_roles')
        .delete()
        .in('employee_id', Object.values(employeeNameToId));
      
      if (deleteError) {
        console.error("Error deleting existing employee roles:", deleteError);
      }
      
      const { error: insertError } = await supabase
        .from('employee_roles')
        .insert(employeeRoles);
      
      if (insertError) {
        console.error("Error creating employee roles associations:", insertError);
        toast({
          title: "Ошибка сохранения ролей сотрудников",
          description: insertError.message,
          variant: "destructive",
        });
        return false;
      }
    }
    
    // Create employee_circles entries based on roles that have circle names
    const employeeCircles = roles
      .filter(role => 
        // Filter out roles without circle name or where we don't have the employee/circle
        role.circleName && 
        employeeNameToId[role.participantName] && 
        circleNameToId[role.circleName]
      )
      .map(role => ({
        employee_id: employeeNameToId[role.participantName],
        circle_id: circleNameToId[role.circleName],
        is_leader: role.roleName.toLowerCase().includes('лидер') || 
                   role.roleName.toLowerCase().includes('leader'),
      }));
    
    // Make the employee_circles entries unique
    const uniqueEmployeeCircles = Array.from(
      new Map(
        employeeCircles.map(item => [
          `${item.employee_id}-${item.circle_id}`, 
          item
        ])
      ).values()
    );
    
    if (uniqueEmployeeCircles.length > 0) {
      // Delete existing entries and insert new ones
      const { error: deleteCircleError } = await supabase
        .from('employee_circles')
        .delete()
        .in('employee_id', Object.values(employeeNameToId));
      
      if (deleteCircleError) {
        console.error("Error deleting existing employee circles:", deleteCircleError);
      }
      
      const { error: insertCircleError } = await supabase
        .from('employee_circles')
        .insert(uniqueEmployeeCircles);
      
      if (insertCircleError) {
        console.error("Error creating employee circles associations:", insertCircleError);
        toast({
          title: "Ошибка сохранения кругов сотрудников",
          description: insertCircleError.message,
          variant: "destructive",
        });
        return false;
      }
    }
    
    console.log("Roles and associations saved successfully:", roles.length);
    return true;
  } catch (error) {
    console.error("Error in saveRolesToSupabase:", error);
    toast({
      title: "Ошибка сохранения ролей",
      description: "Произошла ошибка при сохранении данных ролей",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Save all data to Supabase
 */
export const saveAllDataToSupabase = async (
  employees: Employee[],
  rolesData: RoleData[],
  circlesData: CircleData[],
  leadershipData: LeadershipData[]
): Promise<boolean> => {
  try {
    toast({
      title: "Сохранение данных",
      description: "Начато сохранение данных в Supabase...",
    });
    
    // First save employees and circles (base entities)
    const employeesSaved = await saveEmployeesToSupabase(employees);
    const circlesSaved = await saveCirclesToSupabase(circlesData);
    
    if (!employeesSaved || !circlesSaved) {
      toast({
        title: "Ошибка сохранения",
        description: "Произошла ошибка при сохранении базовых данных",
        variant: "destructive",
      });
      return false;
    }
    
    // Then save roles and associations
    const rolesSaved = await saveRolesToSupabase(rolesData, leadershipData);
    
    if (!rolesSaved) {
      toast({
        title: "Ошибка сохранения",
        description: "Произошла ошибка при сохранении ролей и связей",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Данные сохранены",
      description: "Все данные успешно сохранены в базе данных Supabase",
    });
    
    return true;
  } catch (error) {
    console.error("Error in saveAllDataToSupabase:", error);
    toast({
      title: "Ошибка сохранения",
      description: "Произошла ошибка при сохранении данных в Supabase",
      variant: "destructive",
    });
    return false;
  }
};
