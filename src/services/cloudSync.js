import { getSupabaseClient } from './supabase';

// ─── SERVICIO DE SINCRONIZACIÓN EN TIEMPO REAL ─────────────────────────────────

// 1. Guardar o actualizar la cuenta familiar
export const saveCloudFamily = async (familyData) => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('families').upsert({
      id: familyData.id || 'familia-principal',
      parent_name: familyData.name || 'Papá / Mamá',
      email: familyData.email || '',
      pin: familyData.pin || '1234',
    }, { onConflict: 'id' }).select().single();

    if (error) console.warn('Supabase saveFamily error:', error.message);
    return data;
  } catch (err) {
    console.warn('Error en saveCloudFamily:', err);
    return null;
  }
};

// 2. Guardar o actualizar un hijo
export const saveCloudChild = async (child, familyId = 'familia-principal') => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('children').upsert({
      id: child.id,
      family_id: familyId,
      name: child.name,
      age: child.age || 8,
      icon: child.icon || '🐝',
      coins: child.coins || 0,
      screen_time_used_today: child.screenTimeUsedToday || 0,
      completed_task_ids: child.completedTaskIds || [],
      pending_task_ids: child.pendingTaskIds || [],
      screen_time_investments: child.screenTimeInvestments || [],
    }, { onConflict: 'id' }).select().single();

    if (error) console.warn('Supabase saveChild error:', error.message);
    return data;
  } catch (err) {
    console.warn('Error en saveCloudChild:', err);
    return null;
  }
};

// 3. Crear solicitud de validación de tarea en la nube (cuando el niño reclama)
export const createCloudTaskRequest = async (request, familyId = 'familia-principal') => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('task_validation_requests').upsert({
      id: request.id,
      family_id: familyId,
      child_id: request.childId,
      child_name: request.childName,
      task_title: request.taskTitle,
      task_coins: request.taskCoins,
      status: request.status || 'pending',
      requested_at: request.requestedAt || new Date().toISOString(),
    }, { onConflict: 'id' }).select().single();

    if (error) console.warn('Supabase createTaskRequest error:', error.message);
    return data;
  } catch (err) {
    console.warn('Error en createCloudTaskRequest:', err);
    return null;
  }
};

// 4. Actualizar estado de solicitud (cuando el padre aprueba o rechaza)
export const updateCloudTaskRequestStatus = async (requestId, status, reason = '') => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('task_validation_requests')
      .update({ status })
      .eq('id', requestId)
      .select().single();

    if (error) console.warn('Supabase updateTaskRequest error:', error.message);
    return data;
  } catch (err) {
    console.warn('Error en updateCloudTaskRequestStatus:', err);
    return null;
  }
};

// 5. Cargar datos iniciales de la nube al iniciar la app
export const fetchCloudInitialData = async (familyId = 'familia-principal') => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const [childrenRes, requestsRes] = await Promise.all([
      client.from('children').select('*'),
      client.from('task_validation_requests').select('*').order('requested_at', { ascending: false }),
    ]);

    return {
      children: childrenRes.data || [],
      requests: requestsRes.data || [],
    };
  } catch (err) {
    console.warn('Error al cargar datos de Supabase:', err);
    return null;
  }
};

// 6. Suscribirse a cambios en tiempo real (WebSockets de Supabase)
export const subscribeToCloudRealtime = (onChildChange, onRequestChange) => {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const channel = client
    .channel('colmena-realtime-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'children' }, (payload) => {
      if (onChildChange) onChildChange(payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'task_validation_requests' }, (payload) => {
      if (onRequestChange) onRequestChange(payload);
    })
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};
