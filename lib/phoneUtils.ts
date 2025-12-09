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
 * This allows users to login with local format (e.g., "092862336" or "012345678") 
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
    return formats; // Already in correct format, no need to try others
  }
  
  // If starts with country code 855 (without +), try with +
  if (cleaned.startsWith("855")) {
    formats.push(`+${cleaned}`);
    // Also try without the country code (in case it's stored as local format)
    const withoutCountryCode = cleaned.slice(3);
    if (withoutCountryCode.length >= 8) {
      formats.push(`+855${withoutCountryCode}`);
      formats.push(`0${withoutCountryCode}`);
    }
  }
  
  // If starts with 0 (local Cambodian format like 012345678), try multiple formats
  if (cleaned.startsWith("0")) {
    const withoutZero = cleaned.slice(1);
    // Try with +855 prefix (most common - how it's stored in Supabase)
    formats.push(`+855${withoutZero}`);
    // Also try with just the number (in case stored without country code)
    formats.push(cleaned);
    // Try with 855 prefix (without +)
    formats.push(`855${withoutZero}`);
  }
  
  // If it's a 9-digit number (typical Cambodian mobile without leading 0)
  // like "12345678" or "92862336"
  if (!cleaned.startsWith("+") && !cleaned.startsWith("855") && !cleaned.startsWith("0")) {
    // Try with +855 prefix
    formats.push(`+855${cleaned}`);
    // Try with 0 prefix (local format)
    formats.push(`0${cleaned}`);
    // Try with 855 prefix (without +)
    formats.push(`855${cleaned}`);
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

