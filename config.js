// Supabase Configuration
// Replace these with your actual Supabase project credentials

// Step 1: Update these values after creating your Supabase project
const SUPABASE_CONFIG = {
  url: 'https://potxvxmqeaffcirjejpg.supabase.co', // e.g., 'https://xyzcompany.supabase.co'
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvdHh2eG1xZWFmZmNpcmplanBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0ODUxMDgsImV4cCI6MjA2ODA2MTEwOH0.-cLoMphdqYCDCwUITV6Dd1QqVI_L-zaNreTLH4sWGTk' // Your project's anon/public key
};

// Step 2: Enable Supabase (set to false to use localhost server for development)
const ENABLE_SUPABASE = true;

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPABASE_CONFIG, ENABLE_SUPABASE };
}
