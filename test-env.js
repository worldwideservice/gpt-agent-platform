async function testEnv() {
  try {
    console.log('Testing loadSupabaseServerEnv...');
    const { loadSupabaseServerEnv } = await import('./lib/env/supabase.ts');
    const env = loadSupabaseServerEnv();
    console.log('Env loaded successfully:', {
      hasUrl: !!env.SUPABASE_URL,
      hasAnon: !!env.SUPABASE_ANON_KEY,
      hasService: !!env.SUPABASE_SERVICE_ROLE_KEY,
      urlStart: env.SUPABASE_URL.substring(0, 30) + '...'
    });
  } catch (error) {
    console.error('Error loading env:', error.message);
  }
}

testEnv();
