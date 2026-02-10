/**
 * Supabase Client Initialization
 * 
 * 보안을 위해 아래 URL과 Key 값을 Supabase 프로젝트 설정에서 확인하여 직접 채워주세요.
 * (Settings -> API -> Project URL & Project API keys)
 */

const SUPABASE_URL = 'https://yodlcrmhstknenafluag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvZGxjcm1oc3RrbmVuYWZsdWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTg0NDksImV4cCI6MjA4NjE5NDQ0OX0.yDqEqvDFav_JtcCZDFmcIp1affwfVFUsd4BvzfN3EVg';

// Supabase 클라이언트 초기화 (URL/Key가 없으면 null 반환)
let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
        console.error('Supabase initialization failed:', err);
    }
} else {
    console.warn('Supabase URL or Key is missing. Please check js/supabase.js');
}

export { supabaseClient as supabase };
