
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Employee, RoleData, CircleData, LeadershipData } from "@/types";
import { toast } from "@/components/ui/use-toast";

/**
 * Хук для работы с данными в Supabase
 */
export const useSupabaseData = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Сохранение сотрудников в базу данных
   */
  const saveEmployees = async (employees: Employee[]) => {
    setIsLoading(true);
    
    try {
      for (const employee of employees) {
        // Создаем или обновляем сотрудника в базе данных
        const { data, error } = await supabase
          .from('employees')
          .upsert({
            name: employee.name,
            salary: employee.salary
          }, { onConflict: 'name' })
          .select();
          
        if (error) throw error;
      }
      
      console.log('Сотрудники успешно сохранены в базе данных');
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении сотрудников:', error);
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить данные сотрудников: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Сохранение кругов в базу данных
   */
  const saveCircles = async (circles: CircleData[]) => {
    setIsLoading(true);
    
    try {
      for (const circle of circles) {
        // Создаем или обновляем круг в базе данных
        const { data, error } = await supabase
          .from('circles')
          .upsert({
            name: circle.name,
            functional_type: circle.functionalType
          }, { onConflict: 'name' })
          .select();
          
        if (error) throw error;
      }
      
      console.log('Круги успешно сохранены в базе данных');
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении кругов:', error);
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить данные кругов: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Сохранение ролей в базу данных
   */
  const saveRoles = async (rolesData: RoleData[], customStandardSalaries: Map<string, number>) => {
    setIsLoading(true);
    
    try {
      // Получаем уникальные имена ролей
      const roleNames = new Set<string>();
      
      rolesData.forEach(role => {
        if (role.roleName) {
          roleNames.add(role.roleName);
        }
      });
      
      // Получаем информацию о минимальных/максимальных окладах для каждой роли
      const roleSalaryInfo = new Map<string, { min: number, max: number }>();
      
      // Получаем существующие роли из базы
      const { data: existingRoles, error: fetchError } = await supabase
        .from('roles')
        .select('name, min_salary, max_salary, standard_salary');
        
      if (fetchError) throw fetchError;
      
      // Заполняем информацию из существующих ролей
      const existingRolesMap = new Map<string, any>();
      if (existingRoles) {
        existingRoles.forEach(role => {
          existingRolesMap.set(role.name, {
            min_salary: role.min_salary,
            max_salary: role.max_salary,
            standard_salary: role.standard_salary
          });
        });
      }
      
      // Для каждой роли вычисляем минимальную и максимальную зарплаты
      Array.from(roleNames).forEach(roleName => {
        const salaries = rolesData
          .filter(role => role.roleName === roleName)
          .map(role => {
            const employee = { name: role.participantName, salary: 0 }; // Затем обновим с реальными данными
            return employee.salary;
          })
          .filter(salary => salary > 0);
        
        if (salaries.length > 0) {
          const min = Math.min(...salaries);
          const max = Math.max(...salaries);
          roleSalaryInfo.set(roleName, { min, max });
        } else if (existingRolesMap.has(roleName)) {
          // Используем существующие данные, если нет новых
          const roleData = existingRolesMap.get(roleName);
          roleSalaryInfo.set(roleName, { 
            min: roleData.min_salary || 0, 
            max: roleData.max_salary || 0 
          });
        } else {
          roleSalaryInfo.set(roleName, { min: 0, max: 0 });
        }
      });
      
      // Сохраняем информацию о ролях в базу данных
      for (const roleName of roleNames) {
        const salaryInfo = roleSalaryInfo.get(roleName);
        if (!salaryInfo) continue;
        
        // Получаем стандартный оклад из customStandardSalaries или используем существующий
        let standardSalary: number | null = null;
        
        if (customStandardSalaries.has(roleName)) {
          standardSalary = customStandardSalaries.get(roleName) || null;
        } else if (existingRolesMap.has(roleName)) {
          standardSalary = existingRolesMap.get(roleName).standard_salary;
        }
        
        // Сохраняем или обновляем роль в базе данных
        const { error } = await supabase
          .from('roles')
          .upsert({
            name: roleName,
            min_salary: salaryInfo.min || null,
            max_salary: salaryInfo.max || null,
            standard_salary: standardSalary
          }, { onConflict: 'name' });
          
        if (error) throw error;
      }
      
      console.log('Роли успешно сохранены в базе данных');
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении ролей:', error);
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить данные ролей: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Сохранение связей сотрудник-роль в базу данных
   */
  const saveEmployeeRoles = async (rolesData: RoleData[]) => {
    setIsLoading(true);
    
    try {
      // Сначала получим Map сотрудников по имени
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id, name');
      
      if (empError) throw empError;
      
      if (!employees || employees.length === 0) {
        console.warn('Нет сотрудников для связей сотрудник-роль');
        return false;
      }
      
      const employeeMap = new Map(employees.map(e => [e.name.toLowerCase(), e.id]));
      
      // Для каждого элемента rolesData найдем ID сотрудника и сохраним связь
      for (const role of rolesData) {
        if (!role.participantName || !role.roleName) continue;
        
        // Нормализуем имя для поиска
        const normalizedName = role.participantName.toLowerCase()
          .replace(/["']/g, '')  // Удалить кавычки
          .trim();
        
        const employeeId = employeeMap.get(normalizedName);
        
        if (!employeeId) {
          console.warn(`Сотрудник не найден: ${role.participantName}`);
          continue;
        }
        
        // Сохраняем связь сотрудник-роль
        const { error } = await supabase
          .from('employee_roles')
          .upsert({
            employee_id: employeeId,
            role_name: role.roleName,
            fte: role.fte || 1.0
          });
          
        if (error) throw error;
      }
      
      console.log('Связи сотрудник-роль успешно сохранены');
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении связей сотрудник-роль:', error);
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить связи сотрудник-роль: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Сохранение связей сотрудник-круг в базу данных
   */
  const saveEmployeeCircles = async (rolesData: RoleData[], circles: CircleData[]) => {
    setIsLoading(true);
    
    try {
      // Сначала получим Map сотрудников по имени
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id, name');
      
      if (empError) throw empError;
      
      // Получим Map кругов по имени
      const { data: circlesData, error: circlesError } = await supabase
        .from('circles')
        .select('id, name');
      
      if (circlesError) throw circlesError;
      
      if (!employees || employees.length === 0 || !circlesData || circlesData.length === 0) {
        console.warn('Нет данных для связей сотрудник-круг');
        return false;
      }
      
      const employeeMap = new Map(employees.map(e => [e.name.toLowerCase(), e.id]));
      const circleMap = new Map(circlesData.map(c => [c.name.toLowerCase(), c.id]));
      
      // Для каждого элемента rolesData с circleName найдем ID сотрудника и круга
      for (const role of rolesData) {
        if (!role.participantName || !role.circleName) continue;
        
        // Нормализуем имена для поиска
        const normalizedEmployeeName = role.participantName.toLowerCase()
          .replace(/["']/g, '')
          .trim();
        
        const normalizedCircleName = role.circleName.toLowerCase().trim();
        
        const employeeId = employeeMap.get(normalizedEmployeeName);
        const circleId = circleMap.get(normalizedCircleName);
        
        if (!employeeId) {
          console.warn(`Сотрудник не найден: ${role.participantName}`);
          continue;
        }
        
        if (!circleId) {
          console.warn(`Круг не найден: ${role.circleName}`);
          continue;
        }
        
        // Определяем, является ли сотрудник лидером круга
        const isLeader = role.roleName?.toLowerCase().includes('лидер') || false;
        
        // Сохраняем связь сотрудник-круг
        // Исправление: указываем правильные типы и добавляем onConflict
        const { error } = await supabase
          .from('employee_circles')
          .upsert({
            employee_id: employeeId,
            circle_id: circleId,
            is_leader: isLeader
          }, { onConflict: ['employee_id', 'circle_id'] });
          
        if (error) throw error;
      }
      
      console.log('Связи сотрудник-круг успешно сохранены');
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении связей сотрудник-круг:', error);
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить связи сотрудник-круг: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Загрузка сотрудников из базы данных
   */
  const fetchEmployees = async (): Promise<Employee[]> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return data?.map(item => ({
        id: item.id,
        name: item.name,
        salary: item.salary
      })) || [];
    } catch (error) {
      console.error('Ошибка при загрузке сотрудников:', error);
      toast({
        title: "Ошибка загрузки",
        description: `Не удалось загрузить данные сотрудников: ${(error as Error).message}`,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Загрузка ролей из базы данных
   */
  const fetchRolesData = async (): Promise<RoleData[]> => {
    setIsLoading(true);
    
    try {
      // Загружаем данные о связях сотрудник-роль
      const { data: employeeRoles, error: rolesError } = await supabase
        .from('employee_roles')
        .select(`
          *,
          employee:employee_id (
            name
          )
        `);
        
      if (rolesError) throw rolesError;
      
      // Преобразуем данные в формат RoleData
      return employeeRoles?.map(item => ({
        participantName: item.employee?.name || '',
        roleName: item.role_name,
        fte: item.fte
      })) || [];
    } catch (error) {
      console.error('Ошибка при загрузке ролей:', error);
      toast({
        title: "Ошибка загрузки",
        description: `Не удалось загрузить данные ролей: ${(error as Error).message}`,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Загрузка кругов из базы данных
   */
  const fetchCirclesData = async (): Promise<CircleData[]> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('circles')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return data?.map(item => ({
        name: item.name,
        functionalType: item.functional_type
      })) || [];
    } catch (error) {
      console.error('Ошибка при загрузке кругов:', error);
      toast({
        title: "Ошибка загрузки",
        description: `Не удалось загрузить данные кругов: ${(error as Error).message}`,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Загрузка стандартных окладов ролей из базы данных
   */
  const fetchStandardSalaries = async (): Promise<Map<string, number>> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('name, standard_salary')
        .not('standard_salary', 'is', null);
        
      if (error) throw error;
      
      const salariesMap = new Map<string, number>();
      
      data?.forEach(item => {
        if (item.name && item.standard_salary) {
          salariesMap.set(item.name, item.standard_salary);
        }
      });
      
      return salariesMap;
    } catch (error) {
      console.error('Ошибка при загрузке стандартных окладов:', error);
      toast({
        title: "Ошибка загрузки",
        description: `Не удалось загрузить стандартные оклады: ${(error as Error).message}`,
        variant: "destructive",
      });
      return new Map<string, number>();
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Обновление стандартного оклада для роли
   */
  const updateStandardSalary = async (roleName: string, salary: number): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('roles')
        .update({ standard_salary: salary })
        .eq('name', roleName);
        
      if (error) throw error;
      
      console.log(`Стандартный оклад для роли "${roleName}" обновлен`);
      return true;
    } catch (error) {
      console.error('Ошибка при обновлении стандартного оклада:', error);
      toast({
        title: "Ошибка обновления",
        description: `Не удалось обновить стандартный оклад: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    saveEmployees,
    saveCircles,
    saveRoles,
    saveEmployeeRoles,
    saveEmployeeCircles,
    fetchEmployees,
    fetchRolesData,
    fetchCirclesData,
    fetchStandardSalaries,
    updateStandardSalary
  };
};
