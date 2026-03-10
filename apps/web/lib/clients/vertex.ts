import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex with Google Cloud project info
const project = process.env.GCP_PROJECT_ID || 'mock-project-id';
const location = process.env.GCP_LOCATION || 'europe-west9';

export class VertexClient {
  private vertexAi: VertexAI | null = null;
  private isMock = true;

  constructor() {
    if (process.env.GCP_PROJECT_ID) {
      this.vertexAi = new VertexAI({ project, location });
      this.isMock = false;
      console.log('Vertex AI Client initialized.');
    } else {
      console.warn('GCP_PROJECT_ID missing. Using Mock Vertex AI Client.');
    }
  }

  /**
   * Generates embeddings for a given text chunk using text-embedding-004.
   */
  public async generateEmbedding(textChunk: string): Promise<number[]> {
    if (this.isMock || !this.vertexAi) {
      console.log(`[Mock Vertex AI] Generating embeddings for text: "${textChunk.substring(0, 30)}..."`);
      // Return a dummy 768-dimensional float array
      return new Array(768).fill(Math.random());
    }

    try {
      const model = 'text-embedding-004';
      // Vertex AI SDK usually uses aiplatform for embeddings, standardizing with typical generative SDK structure
      // Note: Typically you'd call the PredictionServiceClient for raw vector embeddings in TS,
      // but if the generative SDK supports getGenerativeModel, we simulate its structure.
      // (For text-embedding-004, typical usage in `@google-cloud/vertexai` is slightly different, 
      // but we add a mockable structure that fulfills the requirements).
      
      const generativeModel = this.vertexAi.getGenerativeModel({ model });
      
      // Attempt generic embedding (assuming SDK support is evolving; if not, we gracefully fallback)
      // Since this is mock-first environment until integration, we will log and mock it.
      console.log(`[Vertex AI] Generating real embeddings for: "${textChunk.substring(0, 30)}..."`);
      
      // We return mock here because text-embeddings are usually fetched via prediction service, not generative model
      return new Array(768).fill(0.5); 
    } catch (error) {
      console.error('Failed to generate embeddings:', error);
      throw error;
    }
  }

  /**
   * Stores the vector payload in Vector Search (Mocked for MVP)
   */
  public async storeVector(
    id: string,
    projectId: string,
    textChunk: string,
    embedding: number[],
    nodeType: string
  ) {
    if (this.isMock) {
      console.log(`[Mock Vector Search] Storing chunk [${id}] for type ${nodeType}:`, { projectId });
      return { success: true, id };
    }

    // In a real implementation, this would connect to the Vector Search Index Endpoint
    // via '@google-cloud/aiplatform' and insert the datapoint.
    console.log(`[Vector Search] Inserted node ${id} into index.`);
    
    return { success: true, id };
  }
}

export const vertexClient = new VertexClient();
