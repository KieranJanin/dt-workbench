/**
 * Mock GCP Cloud DLP SDK logic to extract PII and mutate names/emails into `[PERSON_1]` etc.
 * In a real environment, this would call the Google Cloud DLP API.
 */

export async function sanitizePII(text: string, sessionId: string): Promise<string> {
  // Mock sanitization rules based on PRD requirements
  console.log(`[Cloud DLP Mock] Scanning text for PII...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let sanitizedText = text;

  // Simple hardcoded mock logic for MVP to demonstrate the flow
  const piiMap: Record<string, string> = {
    'Kieran': '[PERSON_1]',
    'John Smith': '[PERSON_2]',
    'John': '[PERSON_2]',
    'jane.doe@example.com': '[EMAIL_1]'
  };

  for (const [pii, token] of Object.entries(piiMap)) {
    const regex = new RegExp(`\\b${pii}\\b`, 'gi');
    if (regex.test(sanitizedText)) {
       console.log(`[Cloud DLP Mock] Found PII: "${pii}". Mutating to ${token}.`);
       sanitizedText = sanitizedText.replace(regex, token);
       // In a real system, we'd cache the mapping { "Kieran": "[PERSON_1]" } in Memorystore (Redis) pegged to sessionId.
       console.log(`[Memorystore Mock] Cached mapping ${pii} -> ${token} for session ${sessionId}`);
    }
  }

  return sanitizedText;
}
