import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { PersonaForm } from './components/PersonaForm';
import type { ObservationPayload } from '@dt-workbench/shared-types';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [metadata, setMetadata] = useState({
    name: '',
    age: '',
    location: '',
    profession: ''
  });

  const handleRecordToggle = async () => {
    if (isRecording) {
      // Stop recording and submit
      setIsRecording(false);
      await handleSubmit();
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: ObservationPayload = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        type: 'audio',
        // Mocking an audio "base64" string or text representation
        content: "TW9jayBhdWRpbyBidWZmZXIgY29udGFpbmluZyBQSUkgbGlrZSBLaWVyYW4gb3IgSm9obiBTbWl0aC4=", // Base64 for "Mock audio buffer containing PII like Kieran or John Smith."
        metadata: {
          name: metadata.name || 'Anonymous',
          age: metadata.age || 'Unknown',
          location: metadata.location || 'Unknown',
          profession: metadata.profession || 'Unknown',
        }
      };

      // In a real app we would use appropriate IP/Hostname instead of localhost for Android/iOS simulators
      const API_URL = 'http://localhost:3000/api/ingestion'; 
      
      console.log('Submitting payload...', payload);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert("Success", "Observation logged successfully!\nSanitized:\n" + result.sanitizedTranscript);
        // Reset form
        setMetadata({ name: '', age: '', location: '', profession: '' });
      } else {
        Alert.alert("Error", result.error || "Failed to submit observation");
      }

    } catch (error: any) {
      console.error(error);
      Alert.alert("Network Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.appTitle}>Field Operations</Text>
      
      {/* Massive Record Button */}
      <View style={styles.recordContainer}>
        <TouchableOpacity 
          style={[
            styles.recordButton, 
            isRecording ? styles.recordButtonActive : styles.recordButtonInactive
          ]}
          onPress={handleRecordToggle}
          disabled={isSubmitting}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? 'STOP & SUBMIT' : 'RECORD OBSERVATION'}
          </Text>
        </TouchableOpacity>
        {isRecording && <Text style={styles.recordingIndicator}>🔴 Recording audio...</Text>}
      </View>

      <PersonaForm metadata={metadata} setMetadata={setMetadata} />

      {isSubmitting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFEB3B" />
          <Text style={styles.loadingText}>Synthesizing...</Text>
        </View>
      )}

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark Theme Background
  },
  contentContainer: {
    padding: 24,
    paddingTop: 80,
  },
  appTitle: {
    color: '#FFEB3B', // Canary Yellow
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  recordContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  recordButtonInactive: {
    backgroundColor: '#FF4081', // Neon Pink
  },
  recordButtonActive: {
    backgroundColor: '#2979FF', // Electric Blue for stop state or pulse
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  recordingIndicator: {
    marginTop: 20,
    color: '#FF4081',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFEB3B',
    marginTop: 10,
    fontSize: 16,
  }
});
