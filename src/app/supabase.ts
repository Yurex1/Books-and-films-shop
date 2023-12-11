
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwdpiokfiissgfviqngz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZHBpb2tmaWlzc2dmdmlxbmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIwNDg2MzcsImV4cCI6MjAxNzYyNDYzN30.CPJj0j6KUpMrvS1AHkYdPrdtiRSp68T9OBVECwhgRFE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
