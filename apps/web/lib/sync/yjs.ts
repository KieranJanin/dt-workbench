import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';

/**
 * Initializes a Yjs Document synced via WebRTC and WebSocket for a specific room.
 * @param roomId The unique identifier for the collaboration session (yjs_room_id).
 */
export function initializeYjsState(roomId: string) {
  // 1. Create the shared Yjs document
  const ydoc = new Y.Doc();

  // 2. Initialize Providers

  // WebRTC Provider enables peer-to-peer sync locally/across clients
  // Useful for fast, direct communication in a 3-user environment.
  const webrtcProvider = new WebrtcProvider(roomId, ydoc, {
    // using public signaling servers for mock/mvp purposes
    // in prod we would host our own via cloud run
    signaling: ['wss://signaling.yjs.dev'] 
  });

  // WebSocket Provider acts as the authoritative central sync 
  // and backup if WebRTC fails to connect between peers.
  // Using a mock public wss for MVP as defined in `02_TECHNICAL_SPEC.md`
  const wsProvider = new WebsocketProvider(
    'wss://demos.yjs.dev', // Replace with internal Cloud Run WebSocket URL for Prod
    roomId,
    ydoc
  );

  // 3. Define the shared data structures
  
  // Example: a shared string state that multiple clients can edit (e.g., active transcription node)
  const sharedText = ydoc.getText('active-observation-draft');
  
  // Example: a shared array of generated insights
  const sharedInsights = ydoc.getArray('insights');

  // Handle connection events
  wsProvider.on('status', (event: { status: string }) => {
    console.log(`[Yjs WebSocket] Status for room ${roomId}: ${event.status}`); // 'connected' or 'disconnected'
  });

  webrtcProvider.on('synced', (event: { synced: boolean }) => {
    console.log(`[Yjs WebRTC] Synced for room ${roomId}: ${event.synced}`);
  });

  return {
    ydoc,
    webrtcProvider,
    wsProvider,
    sharedText,
    sharedInsights
  };
}

/**
 * Clean up providers to prevent memory leaks when a session unmounts
 */
export function destroyYjsState(providers: { webrtcProvider: WebrtcProvider, wsProvider: WebsocketProvider, ydoc: Y.Doc }) {
  providers.webrtcProvider.destroy();
  providers.wsProvider.destroy();
  providers.ydoc.destroy();
}
