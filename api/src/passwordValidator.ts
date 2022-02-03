/**
 * Validates a password.
 *
 * - Must be at least 8 characters long.
 * - Must contain at least one special character (!@#$%^&*()_+-=[]{};':"|,.<>/?)
 * - Must contain at least one uppercase letter
 *
 * @param value The password to validate.
 * @returns The validation result.
 */
export function passwordValidator(value: string) {
  if (value.length <= 8) {
    return Promise.reject('Password must be at least 8 characters long');
  }

  if (value.length >= 20) {
    return Promise.reject('Password must be less than 20 characters long');
  }

  if (!/[A-Z]/.test(value)) {
    return Promise.reject(
      'Password must contain at least one uppercase letter'
    );
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return Promise.reject(
      'Password must contain at least one special character: !@#$%^&*()_+-=[]{};\':"|,.<>/?'
    );
  }

  return Promise.resolve();
}
