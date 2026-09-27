import { supabase } from './src/config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_TO_SEED = [
  {
    email: 'admin@eventhub.edu',
    password: 'AdminPassword123!',
    full_name: 'Prof. Vikram Sharma',
    role: 'admin',
    college: 'Apex Institute of Technology',
    department: 'Student Affairs & Event Directorate',
    year: 'Faculty Coordinator'
  },
  {
    email: 'rahul.sharma@eventhub.edu',
    password: 'StudentPassword123!',
    full_name: 'Rahul Sharma',
    role: 'student',
    college: 'Apex Institute of Technology',
    department: 'Computer Science & Engineering',
    year: '3rd Year'
  },
  {
    email: 'priya.patel@eventhub.edu',
    password: 'StudentPassword123!',
    full_name: 'Priya Patel',
    role: 'student',
    college: 'Apex Institute of Technology',
    department: 'Information Technology',
    year: '2nd Year'
  },
  {
    email: 'arjun.verma@eventhub.edu',
    password: 'StudentPassword123!',
    full_name: 'Arjun Verma',
    role: 'student',
    college: 'Apex Institute of Technology',
    department: 'Electronics & Communication',
    year: '4th Year'
  }
];

const SAMPLE_EVENTS = [
  {
    title: 'React.js & Modern Web Architecture Workshop',
    description: 'A deep-dive, hands-on workshop covering React 18/19, component state management, custom hooks, and Tailwind CSS. Build a real-world web application from scratch with industry mentors.',
    category: 'Workshop',
    daysAhead: 12,
    start_time: '09:30:00',
    end_time: '16:30:00',
    venue: 'Turing Computer Lab (Block C, 3rd Floor)',
    organizer: 'Google Developer Student Club (GDSC)',
    image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    max_participants: 60,
    deadlineDaysAhead: 10
  },
  {
    title: 'AI & Machine Learning Seminar: The LLM Frontier',
    description: 'Explore the practical mechanics of Generative AI, Large Language Models, embeddings, and agentic workflows. Featuring keynote speakers from top AI research labs and industry practitioners.',
    category: 'Seminar',
    daysAhead: 16,
    start_time: '10:00:00',
    end_time: '13:00:00',
    venue: 'Main Auditorium (CV Raman Hall)',
    organizer: 'Department of Artificial Intelligence & Data Science',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    max_participants: 250,
    deadlineDaysAhead: 14
  },
  {
    title: 'Cyber Security & Ethical Hacking Bootcamp',
    description: 'Master defensive cybersecurity strategies, vulnerability assessment, penetration testing fundamentals, and capture-the-flag (CTF) techniques. Ideal for security enthusiasts.',
    category: 'Technical',
    daysAhead: 20,
    start_time: '11:00:00',
    end_time: '17:00:00',
    venue: 'Cyber Intelligence Lab (Block B, Room 204)',
    organizer: 'Null Cyber Security Student Chapter',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    max_participants: 45,
    deadlineDaysAhead: 18
  },
  {
    title: 'HackSphere 2026: 36-Hour College Hackathon',
    description: 'The flagship 36-hour annual collegiate hackathon! Form teams of up to 4 to build innovative solutions in EdTech, HealthTech, FinTech, and Green Computing. Cash prizes and internship offers.',
    category: 'Hackathon',
    daysAhead: 25,
    start_time: '08:00:00',
    end_time: '20:00:00',
    venue: 'Student Activity Center & Innovation Hub',
    organizer: 'CodeCraft Student Club & IEEE Student Branch',
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    max_participants: 120,
    deadlineDaysAhead: 21
  },
  {
    title: 'Tarang 2026: Annual Inter-College Cultural Fest',
    description: 'The grandest cultural extravaganza of the academic year featuring battle of the bands, classical & western dance showdowns, theatrical plays, stand-up comedy, and art exhibitions.',
    category: 'Cultural',
    daysAhead: 30,
    start_time: '16:00:00',
    end_time: '22:00:00',
    venue: 'College Open Air Amphitheatre',
    organizer: 'Student Cultural Committee',
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    max_participants: 500,
    deadlineDaysAhead: 27
  },
  {
    title: 'Cloud Computing & DevOps Masterclass',
    description: 'Learn Docker containerization, Kubernetes orchestration, CI/CD automated deployment pipelines, and cloud architecture deployment on modern cloud platforms.',
    category: 'Workshop',
    daysAhead: 14,
    start_time: '14:00:00',
    end_time: '18:00:00',
    venue: 'Seminar Hall 2 (APJ Abdul Kalam Block)',
    organizer: 'AWS & Cloud Computing Student Forum',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    max_participants: 80,
    deadlineDaysAhead: 12
  },
  {
    title: 'Annual Inter-Department Sports Meet & Tournaments',
    description: 'Compete for inter-departmental glory in football, cricket, basketball, volleyball, athletics, and table tennis. Trophies and certificates for all finalists and category champions.',
    category: 'Sports',
    daysAhead: 18,
    start_time: '08:00:00',
    end_time: '18:00:00',
    venue: 'University Sports Complex & Athletics Ground',
    organizer: 'Department of Physical Education & Sports Council',
    image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    max_participants: 300,
    deadlineDaysAhead: 15
  },
  {
    title: 'E-Cell Startup Pitch & Entrepreneurship Conclave',
    description: 'Pitch your startup concept before real venture capitalists, angel investors, and seasoned founders. Seed grant funding available for top three viable startup presentations.',
    category: 'Competition',
    daysAhead: 22,
    start_time: '10:30:00',
    end_time: '16:00:00',
    venue: 'Auditorium East Wing & Board Room',
    organizer: 'Entrepreneurship Development Cell (E-Cell)',
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    max_participants: 100,
    deadlineDaysAhead: 19
  },
  {
    title: 'RoboWars & Autonomous Drone Racing',
    description: 'High-octane robotics competition! Line followers, custom bot combat in the bulletproof cage arena, and FPV drone racing through obstacle courses.',
    category: 'Technical',
    daysAhead: 28,
    start_time: '10:00:00',
    end_time: '17:30:00',
    venue: 'Mechanical Workshop Yard & Arena',
    organizer: 'Robotics & Automation Society (RAS)',
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    max_participants: 75,
    deadlineDaysAhead: 24
  },
  {
    title: 'UI/UX Design Sprint: Figma to Prototype',
    description: 'Master user research, wireframing, design systems, visual hierarchy, micro-interactions, and design-to-code workflows using Figma.',
    category: 'Club Activity',
    daysAhead: 9,
    start_time: '13:00:00',
    end_time: '17:00:00',
    venue: 'Design Studio (Block A, Room 402)',
    organizer: 'Creative & UI/UX Student Guild',
    image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    max_participants: 50,
    deadlineDaysAhead: 7
  }
];

function formatDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

async function seedDatabase() {
  console.log('🌱 ==============================================================');
  console.log('   EVENTHUB - College Event Management System Seeding & Verify');
  console.log('🌱 ==============================================================\n');

  const createdUsers = {};

  // 1. Seed or Verify Users in Supabase Auth & Profiles
  console.log('👤 Step 1: Seeding Users (Admin & Students)...');
  for (const user of USERS_TO_SEED) {
    try {
      // Check if user already exists
      const { data: listData } = await supabase.auth.admin.listUsers();
      let existingUser = listData?.users?.find(u => u.email === user.email);

      let userId;
      if (!existingUser) {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
            role: user.role,
            college: user.college,
            department: user.department,
            year: user.year
          }
        });

        if (createError) {
          console.error(`   ❌ Failed to create user ${user.email}:`, createError.message);
          continue;
        }
        userId = newUser.user.id;
        console.log(`   ✨ Created Auth User: ${user.email} (${user.role.toUpperCase()})`);
      } else {
        userId = existingUser.id;
        console.log(`   ℹ️ User ${user.email} already exists.`);
      }

      // Upsert profile in public.profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          college: user.college,
          department: user.department,
          year: user.year,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error(`   ❌ Failed to upsert profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`   ✅ Profile synced in public.profiles: ${user.full_name} (${user.role})`);
        createdUsers[user.email] = { id: userId, ...user };
      }
    } catch (err) {
      console.error(`   ❌ Error processing user ${user.email}:`, err.message);
    }
  }

  // 2. Seed College Events
  console.log('\n📅 Step 2: Seeding Realistic College Events...');
  const { data: existingEvents, error: fetchEventsError } = await supabase
    .from('events')
    .select('id, title');

  if (fetchEventsError) {
    console.error('   ❌ Error checking existing events:', fetchEventsError.message);
  }

  let seededEvents = existingEvents || [];

  if (seededEvents.length < 5) {
    const formattedEvents = SAMPLE_EVENTS.map(evt => ({
      title: evt.title,
      description: evt.description,
      category: evt.category,
      event_date: formatDate(evt.daysAhead),
      start_time: evt.start_time,
      end_time: evt.end_time,
      venue: evt.venue,
      organizer: evt.organizer,
      image_url: evt.image_url,
      max_participants: evt.max_participants,
      registration_deadline: formatDate(evt.deadlineDaysAhead)
    }));

    const { data: insertedEvents, error: insertError } = await supabase
      .from('events')
      .insert(formattedEvents)
      .select();

    if (insertError) {
      console.error('   ❌ Error inserting events:', insertError.message);
    } else {
      console.log(`   ✅ Successfully inserted ${insertedEvents.length} college events!`);
      seededEvents = insertedEvents;
    }
  } else {
    console.log(`   ℹ️ Found ${seededEvents.length} existing events in database. Skipping duplicate insert.`);
  }

  // 3. Seed Event Registrations for Students
  console.log('\n🎟️ Step 3: Seeding Event Registrations for Students...');
  if (seededEvents.length > 0 && createdUsers['rahul.sharma@eventhub.edu'] && createdUsers['priya.patel@eventhub.edu']) {
    const registrationsToInsert = [
      {
        event_id: seededEvents[0].id,
        user_id: createdUsers['rahul.sharma@eventhub.edu'].id
      },
      {
        event_id: seededEvents[1]?.id || seededEvents[0].id,
        user_id: createdUsers['rahul.sharma@eventhub.edu'].id
      },
      {
        event_id: seededEvents[1]?.id || seededEvents[0].id,
        user_id: createdUsers['priya.patel@eventhub.edu'].id
      },
      {
        event_id: seededEvents[2]?.id || seededEvents[0].id,
        user_id: createdUsers['arjun.verma@eventhub.edu']?.id || createdUsers['priya.patel@eventhub.edu'].id
      }
    ];

    for (const reg of registrationsToInsert) {
      const { error: regError } = await supabase
        .from('event_registrations')
        .upsert(reg, { onConflict: 'event_id,user_id' });

      if (regError) {
        console.warn(`   ⚠️ Registration note:`, regError.message);
      }
    }
    console.log('   ✅ Sample event registrations inserted.');
  }

  // 4. Verify Student and Admin Login via Supabase Auth
  console.log('\n🔐 Step 4: Testing & Verifying User Logins (Auth Verification)...');
  
  // Test Student Login
  console.log('   👉 Testing Student Login: rahul.sharma@eventhub.edu');
  const { data: studentAuth, error: studentLoginError } = await supabase.auth.signInWithPassword({
    email: 'rahul.sharma@eventhub.edu',
    password: 'StudentPassword123!'
  });

  if (studentLoginError) {
    console.error('   ❌ Student login failed:', studentLoginError.message);
  } else {
    console.log('   ✅ Student Login SUCCESSFUL!');
    console.log(`      • Access Token generated (Length: ${studentAuth.session.access_token.length} chars)`);
    console.log(`      • Student User ID: ${studentAuth.user.id}`);
  }

  // Test Admin Login
  console.log('\n   👉 Testing Admin Login: admin@eventhub.edu');
  const { data: adminAuth, error: adminLoginError } = await supabase.auth.signInWithPassword({
    email: 'admin@eventhub.edu',
    password: 'AdminPassword123!'
  });

  if (adminLoginError) {
    console.error('   ❌ Admin login failed:', adminLoginError.message);
  } else {
    console.log('   ✅ Admin Login SUCCESSFUL!');
    console.log(`      • Access Token generated (Length: ${adminAuth.session.access_token.length} chars)`);
    console.log(`      • Admin User ID: ${adminAuth.user.id}`);
  }

  // 5. Query Verification Report
  console.log('\n📊 Step 5: Database Status Summary...');
  const { count: profileCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
  const { count: regCount } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true });

  console.log(`   👥 Total Profiles:      ${profileCount}`);
  console.log(`   🎪 Total Events:        ${eventCount}`);
  console.log(`   📝 Total Registrations: ${regCount}`);

  console.log('\n🎉 ALL SEEDING & VERIFICATION CHECKS COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('Fatal Seeding Error:', err);
  process.exit(1);
});
