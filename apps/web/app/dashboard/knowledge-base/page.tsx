import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '../../../lib/supabase-server';
import { fetchWithAuth } from '../../../lib/api';
import { KnowledgeBasePage } from './KnowledgeBasePage';

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  let botId: string | undefined;
  try {
    const bots = await fetchWithAuth<{ id: string }[]>('/api/v1/bot');
    botId = bots[0]?.id;
  } catch {
    // handled — KnowledgeBasePage renders empty state without botId
  }

  return <KnowledgeBasePage botId={botId} />;
}
