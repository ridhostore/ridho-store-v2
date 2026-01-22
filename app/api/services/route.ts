// FILE: app/api/services/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Paksa data selalu fresh
export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. KITA DEFINISIKAN SUPABASE LANGSUNG DI SINI (HARDCODE)
    // Ini URL kamu
    const supabaseUrl = 'https://qjvngwskulphqcuphmrm.supabase.co';
    
    // Ini Key Panjang kamu
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdm5nd3NrdWxwaHFjdXBobXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDE3NDIsImV4cCI6MjA4NDY3Nzc0Mn0.Oo8smm85Yd6H2fvzl2t8wIVDPkInzb4BdWa5p_skrVo';

    // 2. Buat Client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Ambil Data
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Server Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}