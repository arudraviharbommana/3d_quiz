// Supabase configuration and client
class SupabaseClient {
  constructor() {
    // Get configuration from config.js or use defaults
    const config = (typeof SUPABASE_CONFIG !== 'undefined') ? SUPABASE_CONFIG : {
      url: 'YOUR_SUPABASE_URL',
      anonKey: 'YOUR_SUPABASE_ANON_KEY'
    };
    
    this.supabaseUrl = config.url;
    this.supabaseKey = config.anonKey;
    
    // Check if credentials are properly configured
    if (this.supabaseUrl === 'YOUR_SUPABASE_URL' || this.supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
      console.warn('⚠️ Supabase credentials not configured. Please update config.js');
      this.client = null;
      return;
    }
    
    // Initialize the client
    if (typeof supabase !== 'undefined') {
      this.client = supabase.createClient(this.supabaseUrl, this.supabaseKey);
      console.log('✅ Supabase client initialized');
    } else {
      console.warn('Supabase library not loaded, falling back to localStorage');
      this.client = null;
    }
  }

  // Save score to Supabase (with duplicate prevention)
  async saveScore(scoreData) {
    if (!this.client) {
      console.log('Supabase not available, using localStorage fallback');
      return this.saveToLocalStorage(scoreData);
    }

    try {
      const normalizedEmail = scoreData.email.toLowerCase().trim();
      
      console.log('📧 Saving score to Supabase for:', normalizedEmail);

      // First, delete any existing score for this email
      const { error: deleteError } = await this.client
        .from('scores')
        .delete()
        .ilike('email', normalizedEmail);

      if (deleteError) {
        console.error('Error deleting existing score:', deleteError);
      }

      // Insert the new score
      const { data, error } = await this.client
        .from('scores')
        .insert([{
          name: scoreData.name.trim(),
          email: normalizedEmail,
          score: scoreData.score,
          total: scoreData.total,
          percentage: scoreData.percentage,
          date: scoreData.date,
          timestamp: Date.now()
        }])
        .select();

      if (error) {
        console.error('Error saving to Supabase:', error);
        return this.saveToLocalStorage(scoreData);
      }

      console.log('✅ Score saved to Supabase:', data);
      return { success: true, data: data[0] };

    } catch (error) {
      console.error('Supabase save error:', error);
      return this.saveToLocalStorage(scoreData);
    }
  }

  // Get all scores from Supabase
  async getScores() {
    if (!this.client) {
      console.log('Supabase not available, using localStorage fallback');
      return this.getFromLocalStorage();
    }

    try {
      const { data, error } = await this.client
        .from('scores')
        .select('name, email, score, total, percentage, date')
        .order('score', { ascending: false })
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching from Supabase:', error);
        return this.getFromLocalStorage();
      }

      console.log('📊 Fetched scores from Supabase:', data.length);
      return data || [];

    } catch (error) {
      console.error('Supabase fetch error:', error);
      return this.getFromLocalStorage();
    }
  }

  // Get scores for a specific user
  async getUserScores(email) {
    if (!this.client) {
      return this.getUserFromLocalStorage(email);
    }

    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      const { data, error } = await this.client
        .from('scores')
        .select('name, email, score, total, percentage, date')
        .ilike('email', normalizedEmail)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching user scores:', error);
        return this.getUserFromLocalStorage(email);
      }

      return data || [];

    } catch (error) {
      console.error('Supabase user fetch error:', error);
      return this.getUserFromLocalStorage(email);
    }
  }

  // Test Supabase connection (for debugging)
  async testConnection() {
    if (!this.client) {
      console.log('❌ Supabase client not available');
      return false;
    }

    try {
      const { data, error } = await this.client
        .from('scores')
        .select('count')
        .limit(1);

      if (error) {
        console.error('❌ Supabase connection test failed:', error);
        return false;
      }

      console.log('✅ Supabase connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
  }

  // LocalStorage fallback methods
  saveToLocalStorage(scoreData) {
    try {
      let scores = JSON.parse(localStorage.getItem('movieQuizScores') || '[]');
      
      // Remove existing score for same email
      const normalizedEmail = scoreData.email.toLowerCase().trim();
      scores = scores.filter(score => score.email.toLowerCase().trim() !== normalizedEmail);
      
      // Add new score
      scores.push(scoreData);
      scores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.date) - new Date(a.date);
      });
      
      localStorage.setItem('movieQuizScores', JSON.stringify(scores));
      console.log('💾 Score saved to localStorage fallback');
      return { success: true, data: scoreData };
    } catch (error) {
      console.error('localStorage save error:', error);
      return { success: false, error };
    }
  }

  getFromLocalStorage() {
    try {
      return JSON.parse(localStorage.getItem('movieQuizScores') || '[]');
    } catch (error) {
      console.error('localStorage fetch error:', error);
      return [];
    }
  }

  getUserFromLocalStorage(email) {
    try {
      const scores = this.getFromLocalStorage();
      const normalizedEmail = email.toLowerCase().trim();
      return scores.filter(score => score.email.toLowerCase().trim() === normalizedEmail);
    } catch (error) {
      console.error('localStorage user fetch error:', error);
      return [];
    }
  }
}

// Initialize global Supabase client
const supabaseClient = new SupabaseClient();
