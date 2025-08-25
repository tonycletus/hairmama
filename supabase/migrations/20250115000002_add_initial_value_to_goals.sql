-- Add initial_value column to hair_goals table
ALTER TABLE public.hair_goals 
ADD COLUMN IF NOT EXISTS initial_value DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Update existing goals to set initial_value to current_value if not set
UPDATE public.hair_goals 
SET initial_value = current_value 
WHERE initial_value = 0 OR initial_value IS NULL;

