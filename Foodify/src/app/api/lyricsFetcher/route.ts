import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getLyrics, fetchLLM } from '@/app/utils/handlers';
import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)    

    if (!session || !session.user) {
        return NextResponse.json({ error: '404 Unauthorized' });
    }
    
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const name = searchParams.get('song');
        const lyricsResponse = await getLyrics(id);
        const combinedWords = lyricsResponse.lines.map(line => line.words).join(' ');
        const llmResponse = await fetchLLM(combinedWords, name);

        return NextResponse.json({ llmResponse });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching API' });
    }
}