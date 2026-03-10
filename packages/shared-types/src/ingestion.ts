export interface PersonaMetadata {
  name: string;
  age: string;
  location: string;
  profession?: string;
}

export interface ObservationPayload {
  id: string;
  timestamp: string;
  type: 'audio' | 'text';
  content: string | null; // audio will be null if text, text will be string
  audioUri?: string; // used internally in the app
  metadata: PersonaMetadata;
}
