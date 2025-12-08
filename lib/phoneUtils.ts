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
 * Validates if a phone number is in E.164 format
 */
export function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{1,14}$/.test(phone);
}

