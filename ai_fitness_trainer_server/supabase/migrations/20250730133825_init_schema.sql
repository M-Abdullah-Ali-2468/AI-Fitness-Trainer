-- 🔐 Users Table — from Clerk
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text not null unique,
  name text not null,
  email text not null unique,
  created_at timestamp not null default now()  -- Store date-time of user creation
);

-- 🧾 Multistep Onboarding Form
create table if not exists onboarding_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  age int not null,
  gender text not null,
  height int not null,
  weight int not null,
  activity text not null,
  occupation text not null,
  smoking text not null,
  alcohol text not null,
  water_intake int not null,
  medical text,
  allergies text,
  injuries text,
  sleep text,
  diet text,
  meal_frequency text,
  workout_time text,
  created_at timestamp not null default now()  -- Store when this form was submitted
);

-- 💪 AI-Generated Fitness Plans
create table if not exists generated_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  days int not null,
  notes text,
  content jsonb not null,              -- Full plan data in JSON
  is_active boolean not null default true,
  created_at timestamp not null default now()  -- When plan was generated
);
