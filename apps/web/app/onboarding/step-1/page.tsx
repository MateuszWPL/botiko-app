import { redirect } from 'next/navigation';

// Industry is selected during registration — no need to pick it again.
// Setup continues via the in-dashboard Wizard.
export default function Step1Redirect() {
  redirect('/dashboard/overview');
}
