import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, Platform, Alert, PermissionsAndroid
} from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { useRouter } from 'expo-router';

export default function CentralScreen() {
  const router = useRouter();
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [status, setStatus] = useState('Idle');

  useEffect(() => {
    return () => {
      if (connectedDevice) {
        connectedDevice.disconnect();
      }
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const startScan = async () => {
    await requestPermissions();
    setDevices([]);
    setStatus('Scanning...');

    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      setDevices(paired);
      setStatus(`Found ${paired.length} paired devices`);

      const unpaired = await RNBluetoothClassic.startDiscovery();
      setDevices(prev => [...prev, ...unpaired]);
      setStatus('Scan complete — tap a device to connect');
    } catch (err: any) {
      setStatus(`Scan failed: ${err.message}`);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    setStatus('Connecting...');
    try {
      const connected = await device.connect({
        connectorType: 'rfcomm',
        DELIMITER: '\n',
        DEVICE_CHARSET: Platform.OS === 'ios' ? 1536 : 'utf-8',
      });
      if (connected) {
        setConnectedDevice(device);
        setStatus(`Connected to ${device.name}! Ready to send.`);
      }
    } catch (err: any) {
      setStatus(`Connection failed: ${err.message}`);
    }
  };


  const sendHelloWorld = async () => {
    if (!connectedDevice) {
      Alert.alert('Not connected', 'Please connect to a device first.');
      return;
    }
    try {
      await connectedDevice.write('Hello World\n');
      setStatus('Sent: Hello World ✅');
    } catch (err: any) {
      setStatus(`Send failed: ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📤 Send Mode</Text>
      <Text style={styles.status}>Status: {status}</Text>

      <TouchableOpacity style={styles.button} onPress={startScan}>
        <Text style={styles.buttonText}>🔍 Scan for Devices</Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.deviceItem,
              connectedDevice?.address === item.address && styles.connectedDevice
            ]}
            onPress={() => connectToDevice(item)}
          >
            <Text style={styles.deviceName}>{item.name || 'Unknown'}</Text>
            <Text style={styles.deviceId}>{item.address}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No devices found yet...</Text>
        }
      />

      <TouchableOpacity
        style={[styles.button, styles.sendButton]}
        onPress={sendHelloWorld}
      >
        <Text style={styles.buttonText}>📤 Send "Hello World"</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8, marginTop: 16 },
  status: { fontSize: 14, color: '#94a3b8', marginBottom: 16 },
  back: { color: '#3b82f6', fontSize: 16, marginBottom: 8 },
  button: {
    backgroundColor: '#3b82f6', padding: 14,
    borderRadius: 10, alignItems: 'center', marginBottom: 16
  },
  sendButton: { backgroundColor: '#10b981', marginTop: 'auto' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deviceItem: {
    backgroundColor: '#1e293b', padding: 14,
    borderRadius: 8, marginBottom: 8
  },
  connectedDevice: { borderWidth: 2, borderColor: '#10b981' },
  deviceName: { color: '#f1f5f9', fontSize: 16 },
  deviceId: { color: '#64748b', fontSize: 11 },
  empty: { color: '#475569', textAlign: 'center', marginTop: 20 },
});