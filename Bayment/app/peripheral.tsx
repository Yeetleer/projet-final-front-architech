import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Platform, Alert, PermissionsAndroid
} from 'react-native';
import BleManager, {
  BleManagerDidUpdateValueForCharacteristicEvent
} from 'react-native-ble-manager';
import { BleManager as BleManagerPLX } from 'react-native-ble-plx';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

const BleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
const bleManagerPLX = new BleManagerPLX();
const SERVICE_UUID = '12345678-1234-1234-1234-123456789012';
const CHARACTERISTIC_UUID = 'abcdefab-cdef-abcd-efab-cdefabcdefab';

const isEmulator = Constants.isDevice === false;

export default function PeripheralScreen() {
  const router = useRouter();
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [receivedMessage, setReceivedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEmulator) {
      setStatus('⚠️ Running on emulator — BLE disabled');
      return;
    }

    BleManager.start({ showAlert: false });

    const valueSub = BleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
        const received = String.fromCharCode(...data.value);
        setReceivedMessage(received);
        Alert.alert('📨 Message Received!', received);
        setStatus(`Received: ${received}`);
      }
    );

    return () => {
      valueSub.remove();
      if (!isEmulator) stopAdvertising();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    } else {
      await request(PERMISSIONS.IOS.BLUETOOTH);
    }
  };

  const startAdvertising = async () => {
    if (isEmulator) {
      setIsAdvertising(true);
      setStatus('📡 Advertising... (mock)');
      setTimeout(() => {
        setReceivedMessage('Hello World');
        Alert.alert('📨 Message Received! (mock)', 'Hello World');
        setStatus('Received: Hello World (mock)');
      }, 3000);
      return;
    }
    await requestPermissions();
    try {
      bleManagerPLX.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error(error);
          return;
        }
      });
      setIsAdvertising(true);
      setStatus('📡 Advertising... waiting for connection');
    } catch (err) {
      setStatus('Failed to start advertising');
      console.error(err);
    }
  };

  const stopAdvertising = async () => {
    if (isEmulator) {
      setIsAdvertising(false);
      setStatus('Stopped advertising (mock)');
      return;
    }
    bleManagerPLX.stopDeviceScan();
    setIsAdvertising(false);
    setStatus('Stopped advertising');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => { stopAdvertising(); router.back(); }}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📡 Receive Mode</Text>

      {isEmulator && (
        <View style={styles.emulatorBanner}>
          <Text style={styles.emulatorText}>⚠️ Emulator mode — BLE is mocked</Text>
        </View>
      )}

      <Text style={styles.status}>Status: {status}</Text>

      {!isAdvertising ? (
        <TouchableOpacity
          style={[styles.button, styles.peripheralButton]}
          onPress={startAdvertising}
        >
          <Text style={styles.buttonText}>Start Advertising</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopAdvertising}
        >
          <Text style={styles.buttonText}>Stop Advertising</Text>
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
  emulatorBanner: {
    backgroundColor: '#854d0e', padding: 10,
    borderRadius: 8, marginBottom: 12
  },
  emulatorText: { color: '#fef08a', textAlign: 'center', fontSize: 13 },
});