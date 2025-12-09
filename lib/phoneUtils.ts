/**
 * Normalizes phone numbers to E.164 format required by Supabase
 * E.164 format: +[country code][number] (e.g., +855123456789)
 */

/**
 * Normalizes a phone number to E.164 format
 * Assumes Cambodian numbers (country code +855) if no country code is present
 * @param phone - Phone number in any format (e.g., "012345678", "+85512345678", "85512345678")
 * @returns Phone number in E.164 format (e.g., "+855123456789")
 */
export function normalizePhoneToE164(phone: string): string {
  if (!phone) return phone;
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");
  
  // If already in E.164 format (starts with +), return as is
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  
  // If starts with country code 855 (without +), add +
  if (cleaned.startsWith("855")) {
    return `+${cleaned}`;
  }
  
  // If starts with 0 (local Cambodian format), replace with +855
  if (cleaned.startsWith("0")) {
    return `+855${cleaned.slice(1)}`;
  }
  
  // Otherwise, assume it's a local number and add +855
  return `+855${cleaned}`;
}

/**
 * Generates all possible phone number formats for login attempts
 * This allows users to login with local format (e.g., "092862336") 
 * even though the phone is stored in E.164 format (e.g., "+85592862336")
 * @param phone - Phone number in any format
 * @returns Array of possible phone formats to try
 */
export function getPhoneLoginFormats(phone: string): string[] {
  if (!phone) return [];
  
  const formats: string[] = [];
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");
  
  // If already in E.164 format (starts with +), add it
  if (cleaned.startsWith("+")) {
    formats.push(cleaned);
  }
  
  // If starts with 855 (without +), try with +
  if (cleaned.startsWith("855")) {
    formats.push(`+${cleaned}`);
  }
  
  // If starts with 0, try replacing with +855
  if (cleaned.startsWith("0")) {
    formats.push(`+855${cleaned.slice(1)}`);
  }
  
  // Also try the cleaned number with +855 prefix
  if (!cleaned.startsWith("+") && !cleaned.startsWith("855") && !cleaned.startsWith("0")) {
    formats.push(`+855${cleaned}`);
  }
  
  // Remove duplicates and return
  return [...new Set(formats)];
}

/**
 * Validates if a phone number is in E.164 format
 */
export function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{1,14}$/.test(phone);
}

