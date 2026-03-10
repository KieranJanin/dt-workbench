import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/workers/whisper_transcriber';
import { sanitizePII } from '@/lib/workers/dlp_sanitizer';
// Assuming @dt-workbench/shared-types is linked or we redefine the types here if monorepo isn't fully linked yet
// For now, we will use a local type definition since app/web might not have the dependency installed
import type { ObservationPayload } from '@dt-workbench/shared-types';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const payload = data as ObservationPayload;

    console.log(`[Ingestion API] Received payload from ${payload.metadata.name}`);
    
    // Simulate audio buffer extraction (in a real app, this might be a multipart form with a File object)
    // For MVP, we're assuming the file or text is sent in the 'content' field
    const audioContent = payload.type === 'audio' ? Buffer.from(payload.content || '', 'base64') : null;
    const textContent = payload.type === 'text' ? payload.content : null;

    // 1. Transcription (Whisper)
    const rawTranscript = await transcribeAudio(audioContent, textContent);
    
    // 2. Sanitization (Cloud DLP)
    // Session ID is mocked for now
    const sessionId = 'mock-session-123';
    const sanitizedTranscript = await sanitizePII(rawTranscript, sessionId);

    console.log(`[Ingestion API] Processing complete. Final Transcript: "${sanitizedTranscript}"`);

    // In a real flow, this would now be sent to Notion and Dual-Written to Neo4j/Vertex AI.
    // Track 5 will handle routing clean text into Notion.

    return NextResponse.json({ 
      success: true, 
      id: payload.id, 
      sanitizedTranscript 
    });

  } catch (error: any) {
    console.error('[Ingestion API] Error processing payload:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
