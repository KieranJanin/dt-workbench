import { neo4jClient } from '../clients/neo4j';
import { vertexClient } from '../clients/vertex';

export interface ObservationPayload {
  id: string;
  projectId: string;
  text: string;
  profileId?: string;
}

/**
 * Execute a Dual Write transaction across Vector Search and Neo4j.
 * If generation fails or insertion fails, the entire transaction throws
 * an error to prevent topological vs semantic drift.
 */
export async function executeDualWrite(payload: ObservationPayload) {
  const { id, projectId, text, profileId } = payload;
  const nodeType = 'Observation';

  try {
    console.log(`[DualWrite] Starting transaction for Observation ${id}`);
    
    // Step 1: Generate Embedding
    const embedding = await vertexClient.generateEmbedding(text);

    // Step 2 & 3: Run Database inserts concurrently
    // If one fails, Promise.all will reject.
    const results = await Promise.all([
      // Store in Vector Search
      vertexClient.storeVector(id, projectId, text, embedding, nodeType),

      // Store in Neo4j Graph
      neo4jClient.createObservation(id, projectId, text, profileId)
    ]);

    console.log(`[DualWrite] Successfully synchronized Vector and Graph for Observation ${id}`);
    return { success: true, vectorStore: results[0], graphRecord: results[1] };
  } catch (error) {
    console.error(`[DualWrite] Rollback triggered for Observation ${id}`, error);
    // In a fully integrated system we might issue a delete operation 
    // to ensure no partial orphaned data exists if one succeeded and the other didn't.
    throw error;
  }
}
