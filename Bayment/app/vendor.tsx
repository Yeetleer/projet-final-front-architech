import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, Platform, Alert, PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { useRouter } from 'expo-router';
import { getUserById } from '../services/api';
import { useUser } from '../context/UserContext';

export default function VendorScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();          // ← get user from context
  const [loadingUser, setLoadingUser] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [status, setStatus] = useState('Ready to scan for buyers');

  // Refresh balance using user.id from context
  const refreshBalance = async () => {
    if (!user) return;
    setLoadingUser(true);
    try {
      const data = await getUserById(user.id);
      setUser(data);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    // Refresh balance when screen loads
    refreshBalance();
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
        setStatus(`Connected to ${device.name}!`);
      }
    } catch (err: any) {
      setStatus(`Connection failed: ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🏪 Vendor Mode</Text>
      <Text style={styles.status}>Status: {status}</Text>

      {/* Balance card — always shown since user comes from context */}
      {loadingUser ? (
        <ActivityIndicator color="#3b82f6" style={{ marginBottom: 16 }} />
      ) : (
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>👤 {user?.username}</Text>
          <Text style={styles.balanceLabel}>💰 My Balance:</Text>
          <Text style={styles.balanceAmount}>{user?.account_money} €</Text>
          <TouchableOpacity onPress={refreshBalance} style={styles.refreshButton}>
            <Text style={styles.refreshText}>🔄 Refresh</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={startScan}>
        <Text style={styles.buttonText}>🔍 Scan for Buyers</Text>
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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  balanceCard: {
    backgroundColor: '#1e293b', padding: 20,
    borderRadius: 10, marginBottom: 16, alignItems: 'center'
  },
  balanceLabel: { color: '#94a3b8', fontSize: 14, marginBottom: 4 },
  balanceAmount: { color: '#10b981', fontSize: 36, fontWeight: 'bold' },
  refreshButton: { marginTop: 8 },
  refreshText: { color: '#3b82f6', fontSize: 13 },
  deviceItem: {
    backgroundColor: '#1e293b', padding: 14,
    borderRadius: 8, marginBottom: 8
  },
  connectedDevice: { borderWidth: 2, borderColor: '#10b981' },
  deviceName: { color: '#f1f5f9', fontSize: 16 },
  deviceId: { color: '#64748b', fontSize: 11 },
  empty: { color: '#475569', textAlign: 'center', marginTop: 20 },
});