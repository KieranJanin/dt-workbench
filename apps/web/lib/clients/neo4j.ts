import neo4j, { Driver, Session } from 'neo4j-driver';

// This is a mock/placeholder implementation since we are waiting on real env variables for Neo4j Aura
export class Neo4jClient {
  private driver: Driver | null = null;
  private isMock = true;

  constructor() {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;

    if (uri && user && password) {
      this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
      this.isMock = false;
      console.log('Neo4j Driver initialized.');
    } else {
      console.warn('Neo4j environment variables missing. Using Mock Neo4j Client.');
    }
  }

  // Helper for mock execution
  private async executeMockQuery(query: string, params: any) {
    console.log(`[Mock Neo4j] Executing Query:\n${query}\nWith params:`, params);
    return { records: [] };
  }

  public async close() {
    if (this.driver) {
      await this.driver.close();
    }
  }

  public async runQuery(cypher: string, params: Record<string, any> = {}) {
    if (this.isMock || !this.driver) {
      return this.executeMockQuery(cypher, params);
    }

    const session: Session = this.driver.session();
    try {
      const result = await session.run(cypher, params);
      return result;
    } finally {
      await session.close();
    }
  }

  // Domain-specific methods

  public async createObservation(observationId: string, projectId: string, text: string, profileId?: string) {
    const query = profileId 
      ? `
        MERGE (p:Project {id: $projectId})
        MERGE (ip:InterviewProfile {id: $profileId})
        CREATE (o:Observation {id: $observationId, text: $text})
        CREATE (o)-[:BELONGS_TO]->(ip)
        CREATE (o)-[:MAPPED_IN]->(p)
        RETURN o
      ` 
      : `
        MERGE (p:Project {id: $projectId})
        CREATE (o:Observation {id: $observationId, text: $text})
        CREATE (o)-[:MAPPED_IN]->(p)
        RETURN o
      `;

    return this.runQuery(query, { observationId, projectId, text, profileId });
  }

  public async createInsight(insightId: string, observationIds: string[], text: string) {
    const query = `
      CREATE (i:Insight {id: $insightId, text: $text})
      WITH i
      UNWIND $observationIds AS obsId
      MATCH (o:Observation {id: obsId})
      CREATE (i)-[:SYNTHESIZED_FROM]->(o)
      RETURN i
    `;
    return this.runQuery(query, { insightId, observationIds, text });
  }

  public async createHMW(hmwId: string, insightIds: string[], text: string) {
    const query = `
      CREATE (h:HMW {id: $hmwId, text: $text})
      WITH h
      UNWIND $insightIds AS insightId
      MATCH (i:Insight {id: insightId})
      CREATE (h)-[:ADDRESSES]->(i)
      RETURN h
    `;
    return this.runQuery(query, { hmwId, insightIds, text });
  }

  public async createConcept(conceptId: string, hmwIds: string[], text: string) {
    const query = `
      CREATE (c:Concept {id: $conceptId, text: $text})
      WITH c
      UNWIND $hmwIds AS hmwId
      MATCH (h:HMW {id: hmwId})
      CREATE (c)-[:SOLVES]->(h)
      RETURN c
    `;
    return this.runQuery(query, { conceptId, hmwIds, text });
  }

  public async createPrototype(prototypeId: string, conceptIds: string[], metadata: any) {
    const query = `
      CREATE (p:Prototype {id: $prototypeId, metadata: $metadata})
      WITH p
      UNWIND $conceptIds AS conceptId
      MATCH (c:Concept {id: conceptId})
      CREATE (p)-[:MANIFESTS]->(c)
      RETURN p
    `;
    return this.runQuery(query, { prototypeId, conceptIds, metadata: JSON.stringify(metadata) });
  }
}

export const neo4jClient = new Neo4jClient();
