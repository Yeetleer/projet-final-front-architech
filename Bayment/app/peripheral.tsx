import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { useRouter } from 'expo-router';

export default function PeripheralScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const startListening = async () => {
    try {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (!enabled) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }

      setIsListening(true);
      setStatus('📡 Waiting for connection...');

      // This makes the phone accept incoming connections
      const device = await RNBluetoothClassic.accept({ delimiter: '\n' });
      if (device) {
        setStatus(`Connected to ${device.name}! Waiting for message...`);

        const dataSubscription = device.onDataReceived((data: any) => {
          const message = data.data.trim();
          setReceivedMessage(message);
          Alert.alert('📨 Message Received!', message);
          setStatus(`Received: ${message}`);
        });

        subscriptionRef.current = dataSubscription;
      }
    } catch (err: any) {
      setStatus(`Failed: ${err.message}`);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setIsListening(false);
    setStatus('Stopped listening');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => { stopListening(); router.back(); }}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📡 Receive Mode</Text>
      <Text style={styles.status}>Status: {status}</Text>

      {!isListening ? (
        <TouchableOpacity
          style={[styles.button, styles.peripheralButton]}
          onPress={startListening}
        >
          <Text style={styles.buttonText}>📡 Start Listening</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopListening}
        >
          <Text style={styles.buttonText}>Stop Listening</Text>
        </TouchableOpacity>
      )}

      {receivedMessage && (
        <View style={styles.messageBox}>
          <Text style={styles.messageLabel}>📨 Received:</Text>
          <Text style={styles.messageText}>{receivedMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8, marginTop: 16 },
  status: { fontSize: 14, color: '#94a3b8', marginBottom: 16 },
  back: { color: '#3b82f6', fontSize: 16, marginBottom: 8 },
  button: {
    padding: 14, borderRadius: 10,
    alignItems: 'center', marginBottom: 16
  },
  peripheralButton: { backgroundColor: '#8b5cf6' },
  stopButton: { backgroundColor: '#ef4444' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  messageBox: {
    backgroundColor: '#1e293b', padding: 20,
    borderRadius: 10, marginTop: 24, alignItems: 'center'
  },
  messageLabel: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
  messageText: { color: '#10b981', fontSize: 24, fontWeight: 'bold' },
});