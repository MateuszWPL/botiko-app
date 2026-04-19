export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function checkPassword(password: string): PasswordRequirement[] {
  return [
    { label: 'Minimum 12 znaków', met: password.length >= 12 },
    { label: 'Co najmniej 1 cyfra', met: /\d/.test(password) },
    { label: 'Co najmniej 1 znak specjalny (!@#$%...)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) },
  ];
}

export function isPasswordValid(password: string): boolean {
  return checkPassword(password).every((r) => r.met);
}
