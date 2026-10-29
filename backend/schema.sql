-- ==============================================================================
-- NxtWave "Build Your First AI Project in 60 Minutes" Workshop
-- Supabase Schema for 500 Final-Year Engineering Student Registrations
-- ==============================================================================

-- 1. Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    college VARCHAR(255) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    graduation_year INT NOT NULL DEFAULT 2025,
    ai_experience VARCHAR(50) NOT NULL DEFAULT 'Beginner',
    channel VARCHAR(100) NOT NULL DEFAULT 'Direct',
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    referred_by VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_referral_code ON public.registrations(referral_code);
CREATE INDEX IF NOT EXISTS idx_registrations_referred_by ON public.registrations(referred_by);
CREATE INDEX IF NOT EXISTS idx_registrations_channel ON public.registrations(channel);
CREATE INDEX IF NOT EXISTS idx_registrations_college ON public.registrations(college);
CREATE INDEX IF NOT EXISTS idx_registrations_branch ON public.registrations(branch);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for public web access
-- Allow anyone to register (Insert)
CREATE POLICY "Allow public registration inserts" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- Allow public reads for leaderboard and referral lookups
CREATE POLICY "Allow public registration reads" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Allow updates/deletes only if authenticated or service role
CREATE POLICY "Allow service role full access" 
ON public.registrations 
FOR ALL 
USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

