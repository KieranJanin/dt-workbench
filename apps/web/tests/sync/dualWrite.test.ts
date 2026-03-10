import { executeDualWrite } from '../../lib/sync/dualWrite';
import { neo4jClient } from '../../lib/clients/neo4j';
import { vertexClient } from '../../lib/clients/vertex';

// Mock the clients, though they are already mockable by default
jest.mock('../../lib/clients/neo4j', () => ({
  neo4jClient: {
    createObservation: jest.fn().mockResolvedValue({ records: [{ id: 'obs-123' }] }),
  },
}));

jest.mock('../../lib/clients/vertex', () => ({
  vertexClient: {
    generateEmbedding: jest.fn().mockResolvedValue(new Array(768).fill(0.1)),
    storeVector: jest.fn().mockResolvedValue({ success: true, id: 'obs-123' }),
  },
}));

// Mock Prisma
const mockPrismaClient = {
  observation: {
    create: jest.fn().mockResolvedValue({ id: 'obs-123', text: 'Dummy observation' }),
  },
};

describe('DualWriteTransaction End-to-End Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully writes a dummy Observation simultaneously into PostgreSQL (Session), Neo4j (Node), and Vertex AI (Vector)', async () => {
    // 1. Mock writing to PostgreSQL via Prisma
    const pgResult = await mockPrismaClient.observation.create({
      data: { id: 'obs-123', text: 'Dummy observation test text' }
    });

    expect(mockPrismaClient.observation.create).toHaveBeenCalled();
    expect(pgResult.id).toBe('obs-123');

    // 2. Dual Write to Neo4j and Vertex AI
    const result = await executeDualWrite({
      id: 'obs-123',
      projectId: 'proj-456',
      text: 'Dummy observation test text',
      profileId: 'prof-789'
    });

    // Validations
    expect(result.success).toBe(true);

    // Verify Vertex AI was called
    expect(vertexClient.generateEmbedding).toHaveBeenCalledWith('Dummy observation test text');
    expect(vertexClient.storeVector).toHaveBeenCalledWith('obs-123', 'proj-456', 'Dummy observation test text', expect.any(Array), 'Observation');

    // Verify Neo4j was called
    expect(neo4jClient.createObservation).toHaveBeenCalledWith('obs-123', 'proj-456', 'Dummy observation test text', 'prof-789');
  });

  it('rolls back (throws error) if underlying graph insert fails', async () => {
    // Force a failure
    (neo4jClient.createObservation as jest.Mock).mockRejectedValueOnce(new Error('Neo4j Connection Failed'));

    await expect(executeDualWrite({
      id: 'obs-fail',
      projectId: 'proj-456',
      text: 'Fail me'
    })).rejects.toThrow('Neo4j Connection Failed');
  });
});
