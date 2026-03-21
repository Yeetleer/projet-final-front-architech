import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { useRouter } from 'expo-router';
<<<<<<< HEAD
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top > 0 ? insets.top : 24,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 24
      }
    ]}>
      <Text style={styles.title}>Bayment</Text>
      <Text style={styles.subtitle}>Connectez, Payez, Souriez !</Text>
=======
import { request, PERMISSIONS } from 'react-native-permissions';
import { useUser } from '../context/UserContext';
import UserCard from '../components/UserCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    } else {
      await request(PERMISSIONS.IOS.BLUETOOTH);
    }
  };

  return (
    <View style={styles.container}>
>>>>>>> upstream/main

      {/* Username in top right corner */}
      {user && (
        <View style={styles.header}>
          <Text style={styles.username}>👤 {user.username}</Text>
        </View>
      )}

<<<<<<< HEAD
      <TouchableOpacity
        style={[styles.button, styles.centralButton]}
        onPress={() => router.push('/central')}
      >
        <Text style={styles.buttonText}>📤 Send Mode</Text>
        <Text style={styles.buttonSubtext}>Scan, connect & send "Hello World"</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.authButton]} onPress={() => router.push('/auth')}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
      </View>
=======
      <Text style={styles.title}>📶 Bayment</Text>

      {user ? (
        <>
          {/* Full user card with add/withdraw buttons */}
          <UserCard compact={false} />

          <TouchableOpacity
            style={[styles.button, styles.buyerButton]}
            onPress={() => router.push('/buyer')}
          >
            <Text style={styles.buttonText}>🛍️ Buyer Mode</Text>
            <Text style={styles.buttonSubtext}>Wait for vendor & receive payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.vendorButton]}
            onPress={() => router.push('/vendor')}
          >
            <Text style={styles.buttonText}>🏪 Vendor Mode</Text>
            <Text style={styles.buttonSubtext}>Scan for buyer & send payment request</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/auth')}
        >
          <Text style={styles.buttonText}>🔐 Connect</Text>
        </TouchableOpacity>
      )}
>>>>>>> upstream/main
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, padding: 24, backgroundColor: '#0f172a' },
  title: { textAlign: 'center', fontSize: 54, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8, marginTop: 16 },
  subtitle: { textAlign: 'center', fontSize: 16, color: '#94a3b8', marginBottom: 32 },
=======
  container: { flex: 1, padding: 24, backgroundColor: '#0f172a', justifyContent: 'center' },
  header: { position: 'absolute', top: 48, right: 24 },
  username: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc', marginBottom: 24, textAlign: 'center' },
  loginButton: {
    backgroundColor: '#3b82f6', padding: 16,
    borderRadius: 12, alignItems: 'center', marginBottom: 16
  },
>>>>>>> upstream/main
  button: {
    padding: 14, borderRadius: 10,
    alignItems: 'center', marginBottom: 16
  },
<<<<<<< HEAD
  footer: {flex: 1, justifyContent: 'flex-end', },
  authButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 80
  },
  peripheralButton: { backgroundColor: '#8b5cf6' },
  centralButton: { backgroundColor: '#3b82f6' },
=======
  buyerButton: { backgroundColor: '#8b5cf6' },
  vendorButton: { backgroundColor: '#3b82f6' },
>>>>>>> upstream/main
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonSubtext: { color: '#e2e8f0', fontSize: 12, marginTop: 4 },
});