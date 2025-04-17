
import { supabase } from '@/lib/supabase';
import { Employee, RoleData, CircleData, LeadershipData } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const saveEmployeesToSupabase = async (employees: Employee[]): Promise<string[]> => {
  try {
    const employeeIds: string[] = [];
    
    for (const employee of employees) {
      // Проверка на существование сотрудника по имени
      const { data: existingEmployee } = await supabase
        .from('employees')
        .select('id')
        .eq('name', employee.name)
        .single();
      
      if (existingEmployee) {
        // Обновляем существующего сотрудника
        const { error } = await supabase
          .from('employees')
          .update({
            salary: employee.salary,
            position: employee.position || null,
            department: employee.department || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEmployee.id);
        
        if (error) throw error;
        employeeIds.push(existingEmployee.id);
      } else {
        // Добавляем нового сотрудника
        const { data, error } = await supabase
          .from('employees')
          .insert({
            name: employee.name,
            salary: employee.salary,
            position: employee.position || null,
            department: employee.department || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (error) throw error;
        if (data) employeeIds.push(data.id);
      }
    }
    
    return employeeIds;
  } catch (error) {
    console.error('Ошибка при сохранении сотрудников:', error);
    throw error;
  }
};

export const saveCirclesToSupabase = async (circles: CircleData[]): Promise<string[]> => {
  try {
    const circleIds: string[] = [];
    
    for (const circle of circles) {
      // Проверка на существование круга по имени
      const { data: existingCircle } = await supabase
        .from('circles')
        .select('id')
        .eq('name', circle.name)
        .single();
      
      if (existingCircle) {
        // Обновляем существующий круг
        const { error } = await supabase
          .from('circles')
          .update({
            functional_type: circle.functionalType,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCircle.id);
        
        if (error) throw error;
        circleIds.push(existingCircle.id);
      } else {
        // Добавляем новый круг
        const { data, error } = await supabase
          .from('circles')
          .insert({
            name: circle.name,
            functional_type: circle.functionalType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (error) throw error;
        if (data) circleIds.push(data.id);
      }
    }
    
    return circleIds;
  } catch (error) {
    console.error('Ошибка при сохранении кругов:', error);
    throw error;
  }
};

export const saveLeadershipDataToSupabase = async (leadershipData: LeadershipData[]): Promise<void> => {
  try {
    for (const leadership of leadershipData) {
      // Проверка на существование записи о лидерстве по имени роли
      const { data: existingLeadership } = await supabase
        .from('leadership')
        .select('id')
        .eq('role_name', leadership.roleName)
        .single();
      
      if (existingLeadership) {
        // Обновляем существующую запись
        const { error } = await supabase
          .from('leadership')
          .update({
            standard_salary: leadership.standardSalary,
            description: leadership.description || null,
            leadership_type: leadership.leadershipType || null,
            circle_count: leadership.circleCount || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLeadership.id);
        
        if (error) throw error;
      } else {
        // Добавляем новую запись
        const { error } = await supabase
          .from('leadership')
          .insert({
            role_name: leadership.roleName,
            standard_salary: leadership.standardSalary,
            description: leadership.description || null,
            leadership_type: leadership.leadershipType || null,
            circle_count: leadership.circleCount || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
    }
  } catch (error) {
    console.error('Ошибка при сохранении данных о лидерстве:', error);
    throw error;
  }
};

export const saveRolesToSupabase = async (
  roles: RoleData[], 
  employeeNameToIdMap: Map<string, string>,
  circleNameToIdMap: Map<string, string>
): Promise<void> => {
  try {
    for (const role of roles) {
      const employeeId = employeeNameToIdMap.get(role.participantName);
      let circleId = null;
      
      if (role.circleName) {
        circleId = circleNameToIdMap.get(role.circleName);
      }
      
      if (!employeeId) {
        console.warn(`Не найден ID сотрудника для роли: ${role.roleName} (участник: ${role.participantName})`);
        continue;
      }
      
      // Проверка на существование роли
      const { data: existingRole } = await supabase
        .from('roles')
        .select('id')
        .eq('employee_id', employeeId)
        .eq('role_name', role.roleName)
        .single();
      
      if (existingRole) {
        // Обновляем существующую роль
        const { error } = await supabase
          .from('roles')
          .update({
            fte: role.fte || null,
            circle_id: circleId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRole.id);
        
        if (error) throw error;
      } else {
        // Добавляем новую роль
        const { error } = await supabase
          .from('roles')
          .insert({
            employee_id: employeeId,
            role_name: role.roleName,
            fte: role.fte || null,
            circle_id: circleId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
    }
  } catch (error) {
    console.error('Ошибка при сохранении ролей:', error);
    throw error;
  }
};

export const saveAllDataToSupabase = async (
  employees: Employee[],
  roles: RoleData[],
  circles: CircleData[],
  leadershipData: LeadershipData[]
): Promise<boolean> => {
  try {
    // Шаг 1: Сохраняем сотрудников и получаем их ID
    const employeeIds = await saveEmployeesToSupabase(employees);
    const employeeNameToIdMap = new Map<string, string>();
    
    // Создаем карту соответствия имен сотрудников их ID
    for (let i = 0; i < employees.length; i++) {
      if (i < employeeIds.length) {
        employeeNameToIdMap.set(employees[i].name, employeeIds[i]);
      }
    }
    
    // Шаг 2: Сохраняем круги и получаем их ID
    const circleIds = await saveCirclesToSupabase(circles);
    const circleNameToIdMap = new Map<string, string>();
    
    // Создаем карту соответствия названий кругов их ID
    for (let i = 0; i < circles.length; i++) {
      if (i < circleIds.length) {
        circleNameToIdMap.set(circles[i].name, circleIds[i]);
      }
    }
    
    // Шаг 3: Сохраняем данные о лидерстве
    await saveLeadershipDataToSupabase(leadershipData);
    
    // Шаг 4: Сохраняем роли, привязывая их к сотрудникам и кругам
    await saveRolesToSupabase(roles, employeeNameToIdMap, circleNameToIdMap);
    
    toast({
      title: "Данные успешно сохранены в Supabase",
      description: `Сохранено: ${employeeIds.length} сотрудников, ${circleIds.length} кругов, ${roles.length} ролей и ${leadershipData.length} записей о лидерстве.`,
    });
    
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении данных в Supabase:', error);
    toast({
      title: "Ошибка сохранения данных",
      description: `Произошла ошибка при сохранении данных в Supabase: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      variant: "destructive",
    });
    return false;
  }
};
