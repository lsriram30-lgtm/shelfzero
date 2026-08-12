const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

// Loose on purpose — just enough digits to catch obvious garbage (a name
// typed into the wrong field, a couple of stray digits) without rejecting
// real international formats, extensions, or punctuation styles.
const MIN_PHONE_DIGITS = 7;

export function isValidPhone(phone: string): boolean {
  const digitCount = (phone.match(/\d/g) ?? []).length;
  return digitCount >= MIN_PHONE_DIGITS;
}
