
import { LeadershipData } from "@/types";
import { cleanFunctionalType } from "../formatUtils";

/**
 * Find the standard salary for a leadership role based on functional type and circle count
 * 
 * @param functionalType The functional type of the leadership (e.g., "Delivery", "Discovery")
 * @param circleCount The number of circles as a string
 * @param leadershipData Array of leadership data from the table
 * @returns The standard salary or null if not found
 */
export const findLeadershipStandardSalary = (
  functionalType: string,
  circleCount: string,
  leadershipData: LeadershipData[]
): number | null => {
  if (!functionalType || !circleCount || !leadershipData?.length || circleCount === "0") {
    console.log("Missing leadership data for lookup:", { functionalType, circleCount, hasLeadershipData: Boolean(leadershipData?.length) });
    return null;
  }
  
  const cleanedType = cleanFunctionalType(functionalType).toLowerCase();
  
  console.log(`Looking for leadership salary: type="${cleanedType}", circles=${circleCount}, data entries=${leadershipData.length}`);
  
  if (cleanedType === "не указано") {
    for (const entry of leadershipData) {
      if (entry.circleCount === circleCount) {
        console.log(`Found circle count match for unspecified type: (${entry.circleCount} circles) = ${entry.standardSalary}`);
        return entry.standardSalary;
      }
    }

    for (const entry of leadershipData) {
      if (
        entry.leadershipType &&
        (entry.leadershipType.toLowerCase() === "общий" || 
         entry.leadershipType.toLowerCase() === "general") &&
        entry.circleCount === circleCount
      ) {
        console.log(`Found general type match: ${entry.leadershipType} (${entry.circleCount}) = ${entry.standardSalary}`);
        return entry.standardSalary;
      }
    }

    return null;
  }
  
  // First try: exact match
  for (const entry of leadershipData) {
    if (
      entry.leadershipType && 
      cleanFunctionalType(entry.leadershipType).toLowerCase() === cleanedType &&
      entry.circleCount === circleCount
    ) {
      console.log(`Found exact leadership match: ${entry.leadershipType} (${entry.circleCount}) = ${entry.standardSalary}`);
      return entry.standardSalary;
    }
  }
  
  // Special case for "Discovery" to match "Delivery & Discovery"
  if (cleanedType === "discovery") {
    for (const entry of leadershipData) {
      if (
        entry.leadershipType &&
        entry.leadershipType.toLowerCase().includes("discovery") &&
        entry.circleCount === circleCount
      ) {
        console.log(`Found Discovery in combined type match: ${entry.leadershipType} (${entry.circleCount}) = ${entry.standardSalary}`);
        return entry.standardSalary;
      }
    }
  }
  
  // Second try: partial match (type is included in entry)
  for (const entry of leadershipData) {
    if (
      entry.leadershipType && 
      cleanFunctionalType(entry.leadershipType).toLowerCase().includes(cleanedType) &&
      entry.circleCount === circleCount
    ) {
      console.log(`Found partial leadership match: ${entry.leadershipType} (${entry.circleCount}) = ${entry.standardSalary}`);
      return entry.standardSalary;
    }
  }
  
  // Third try: type is included in entry (unclean comparison)
  for (const entry of leadershipData) {
    if (
      entry.leadershipType && 
      entry.leadershipType.toLowerCase().includes(functionalType.toLowerCase()) &&
      entry.circleCount === circleCount
    ) {
      console.log(`Found fallback leadership match: ${entry.leadershipType} (${entry.circleCount}) = ${entry.standardSalary}`);
      return entry.standardSalary;
    }
  }
  
  // Last try: match only by circle count if not zero
  if (circleCount !== "0") {
    for (const entry of leadershipData) {
      if (entry.circleCount === circleCount) {
        console.log(`Found circle-count-only match: ${entry.leadershipType} (${entry.circleCount}) = ${entry.standardSalary}`);
        return entry.standardSalary;
      }
    }
  }
  
  console.log(`No leadership salary found for: type="${cleanedType}", circles=${circleCount}`);
  return null;
};
