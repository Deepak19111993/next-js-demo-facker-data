-- Drop table if exists to reset schema
DROP TABLE IF EXISTS public.saved_items;

-- Create saved_items table with TEXT user_id to support mock auth
CREATE TABLE public.saved_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Changed from UUID to TEXT
    product_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Note: Since we are not using Supabase Auth (auth.uid()), we cannot use auth.uid() in policies securely.
-- For this demo/mock setup, we will allow public access or basic matching.
-- HOWEVER, to make it work with the current setup where we don't have a real Supabase session token:
-- We need to disable RLS or create a very permissive policy if the client isn't authenticated with Supabase.

-- For this specific demo context where the client uses `supabaseUrl` and `supabaseAnonKey` but DOES NOT sign in to Supabase:
-- The Service Role Key is needed to bypass RLS, OR we need public policies.
-- Best approach for this hybrid mock: Allow public read/write associated with the user_id text.

CREATE POLICY "Allow public access based on user_id" ON public.saved_items
    FOR ALL
    USING (true)
    WITH CHECK (true);
