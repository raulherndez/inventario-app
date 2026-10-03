import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserSubscription(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error al obtener la suscripción:', error.message);
    return null;
  }

  return data;
}

export async function updateUserSubscription(userId, planType) {
  if (!userId) return { success: false, error: 'No user ID provided' };

  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert(
      { 
        user_id: userId, 
        plan_type: planType, 
        status: 'active',
        updated_at: new Date().toISOString() 
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('Error al actualizar la suscripción:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}