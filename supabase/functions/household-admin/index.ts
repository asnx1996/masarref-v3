// ============================================================
//  household-admin — إدارة أعضاء العائلة (للأدمن بس)
// ============================================================
//  ليش Edge Function ومو RPC عادي؟
//   - تغيير باسورد يوزر ثاني يحتاج مفتاح service_role مال Supabase.
//   - هذا المفتاح يتجاوز كل حماية RLS، فلو انحط بالتطبيق (PWA بالمتصفح)
//     أي واحد يفتح أدوات المطوّر ياخذه ويصير عنده سيطرة كاملة.
//   - هنا المفتاح يبقى بالسيرفر بس، والدالة تتأكد بنفسها إن اللي يطلب
//     هو أدمن نفس العائلة قبل ما تسوي أي شي.
//
//  الإجراءات:
//   list        → قائمة أعضاء عائلتك (الاسم + الإيميل + هل هو أدمن)
//   setPassword → غيّر باسورد عضو بعائلتك
//   remove      → شيله من العائلة (حسابه يبقى موجود بس بلا عائلة)
//
//  ⚠️ ما يغطي حالة: الأدمن نفسه نسى باسورده. وقتها من لوحة Supabase:
//     Authentication ← Users ← اليوزر ← Reset password
//
//  الرفع: supabase functions deploy household-admin
//  (أو انرفعت أصلاً عبر أدوات Supabase)
// ============================================================

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST بس' }, 405);

  // مفتاح الخدمة — موجود تلقائياً ببيئة Edge Functions، ما ينوصل من الواجهة
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  try {
    // ---------- ١) منو اللي يطلب؟ ----------
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token) return json({ error: 'الدخول مطلوب' }, 401);

    const { data: authData, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !authData?.user) return json({ error: 'الدخول مطلوب' }, 401);
    const callerId = authData.user.id;

    // ---------- ٢) هل هو أدمن؟ وأي عائلة؟ ----------
    const { data: me, error: meErr } = await admin
      .from('profiles')
      .select('household_id, is_admin')
      .eq('id', callerId)
      .single();

    if (meErr || !me) return json({ error: 'ما لكيت حسابك' }, 403);
    if (!me.is_admin) return json({ error: 'هذا الإجراء للأدمن بس' }, 403);
    if (!me.household_id) return json({ error: 'حسابك مو مربوط بعائلة' }, 403);

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || '');

    // ---------- ٣) قائمة الأعضاء ----------
    if (action === 'list') {
      const { data: members, error } = await admin
        .from('profiles')
        .select('id, display_name, is_admin')
        .eq('household_id', me.household_id)
        .order('is_admin', { ascending: false });
      if (error) return json({ error: error.message }, 500);

      // الإيميلات من auth.users — لازم مفتاح الخدمة
      const withEmail = await Promise.all(
        (members || []).map(async (m) => {
          const { data } = await admin.auth.admin.getUserById(m.id);
          return {
            id: m.id,
            name: m.display_name || '',
            admin: !!m.is_admin,
            email: data?.user?.email || '',
            self: m.id === callerId,
          };
        }),
      );
      return json({ ok: true, members: withEmail });
    }

    // الإجراءات الباقية كلها تحتاج هدف — ولازم يكون بنفس العائلة
    const targetId = String(body.userId || '');
    if (!targetId) return json({ error: 'حدد العضو' }, 400);

    const { data: target, error: tErr } = await admin
      .from('profiles')
      .select('id, display_name, is_admin, household_id')
      .eq('id', targetId)
      .single();

    if (tErr || !target) return json({ error: 'العضو غير موجود' }, 404);
    // 🔒 الحاجز الأهم: ممنوع تلمس أي واحد برّا عائلتك
    if (target.household_id !== me.household_id) {
      return json({ error: 'هذا العضو مو بعائلتك' }, 403);
    }

    // ---------- ٤) تغيير الباسورد ----------
    if (action === 'setPassword') {
      const password = String(body.password || '');
      if (password.length < 6) return json({ error: 'الباسورد قصير — ٦ خانات على الأقل' }, 400);

      const { error } = await admin.auth.admin.updateUserById(targetId, { password });
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, name: target.display_name || '' });
    }

    // ---------- ٥) شيله من العائلة ----------
    if (action === 'remove') {
      if (targetId === callerId) return json({ error: 'ما تكدر تشيل نفسك من العائلة' }, 400);
      if (target.is_admin) return json({ error: 'ما تكدر تشيل أدمن ثاني' }, 400);

      // الحساب يبقى موجود — بس ينفكّ عن العائلة (ما يعود يشوف بياناتها)
      const { error } = await admin
        .from('profiles')
        .update({ household_id: null })
        .eq('id', targetId);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, name: target.display_name || '' });
    }

    return json({ error: 'إجراء غير معروف' }, 400);
  } catch (e) {
    return json({ error: (e as Error).message || 'خطأ بالخادم' }, 500);
  }
});
