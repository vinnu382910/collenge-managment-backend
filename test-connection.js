import { supabase } from './src/config/supabase.js';

async function testConnection() {
  console.log('🔄 Testing Supabase Connection from EventHub Backend...');
  console.log(`📡 Supabase URL: ${process.env.SUPABASE_URL}`);

  try {
    // Test 1: Verify Auth Admin API using Service Role Key
    const { data: usersData, error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    
    if (authError) {
      console.error('❌ Supabase Auth API Error:', authError.message);
      process.exit(1);
    }

    console.log('✅ Supabase Auth & Service Role Key successfully verified!');
    console.log(`👥 Total users currently in auth: ${usersData?.users?.length ?? 0}`);

    console.log('🎉 Supabase connection is HEALTHY and ACTIVE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error connecting to Supabase:', err.message);
    process.exit(1);
  }
}

testConnection();
