import { checkPassword } from '../../lib/password';

interface Props {
  password: string;
}

export function PasswordRequirements({ password }: Props) {
  if (!password) return null;

  const requirements = checkPassword(password);

  return (
    <ul className="mt-2 space-y-1">
      {requirements.map((req) => (
        <li key={req.label} className="flex items-center gap-2">
          {req.met ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="3">
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
          <span className={`text-xs transition-colors ${req.met ? 'text-emerald-600' : 'text-slate-400'}`}>
            {req.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
