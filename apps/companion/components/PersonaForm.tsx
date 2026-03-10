import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PersonaFormProps {
  metadata: {
    name: string;
    age: string;
    location: string;
    profession: string;
  };
  setMetadata: React.Dispatch<React.SetStateAction<{
    name: string;
    age: string;
    location: string;
    profession: string;
  }>>;
}

export function PersonaForm({ metadata, setMetadata }: PersonaFormProps) {
  const handleChange = (field: string, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Persona Metadata (Async)</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name (e.g., Kieran)"
        placeholderTextColor="#888"
        value={metadata.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={metadata.age}
        onChangeText={(text) => handleChange('age', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#888"
        value={metadata.location}
        onChangeText={(text) => handleChange('location', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Profession"
        placeholderTextColor="#888"
        value={metadata.profession}
        onChangeText={(text) => handleChange('profession', text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    color: '#2979FF', // Electric Blue
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  }
});
