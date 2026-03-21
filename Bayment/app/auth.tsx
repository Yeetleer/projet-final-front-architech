import React, { useState, useRef, useEffect } from 'react';

import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Buffer } from 'buffer';
import { requestMagicLink } from '../services/api';
import { useUser } from '../context/UserContext';
import { getUserByEmail } from '../services/api';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);



  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // Gérer le retour du Deep Link (le token est dans les params de l'URL)
=======
  console.log()
>>>>>>> upstream/main
  useEffect(() => {
    if (params.token) {
      handleTokenReceived(params.token as string);
    }
  }, [params.token]);

  const handleTokenReceived = async (token: string) => {
    try {
      setLoading(true);
<<<<<<< HEAD
      console.log('Token reçu via Deep Link:', token);

      // On décode sommairement le JWT pour extraire l'email
=======

>>>>>>> upstream/main
      let userEmail = '';
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        userEmail = decoded.mail;
      } catch (e) {
<<<<<<< HEAD
        console.log("Erreur décodage token:", e);
      }

      showToast('Connexion réussie !', 'success');

      // Attendre un peu avant de rediriger
      setTimeout(() => {
        router.replace({
          pathname: '/central',
          params: { userEmail: userEmail }
        });
      }, 1500);
    } catch (error) {
      showToast('Erreur lors de la connexion.', 'error');
=======
        console.log("Token decoding error:", e);
      }

      // Fetch user by email and store in context
      const userData = await getUserByEmail(userEmail);
      setUser(userData);

      showToast('Connection successful !', 'success');

      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (error) {
      showToast('Error while connecting.', 'error');
>>>>>>> upstream/main
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======

>>>>>>> upstream/main
  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: insets.top + 10, duration: 300, useNativeDriver: true })
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true })
      ]).start(() => setToast(null));
    }, 3000);
  };

  const handleLogin = async () => {
    if (!email) {
<<<<<<< HEAD
      showToast('Veuillez entrer votre adresse e-mail.', 'error');
=======
      showToast('Enter your e-mail address.', 'error');
>>>>>>> upstream/main
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
<<<<<<< HEAD
      showToast('Adresse e-mail invalide.', 'error');
=======
      showToast('Unvalide e-mail address.', 'error');
>>>>>>> upstream/main
      return;
    }

    setLoading(true);

    try {
<<<<<<< HEAD
      console.log(`Tentative d'envoi d'un lien de connexion à : ${API_URL}/auth/login`);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail: email.toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setLinkSent(true);
        showToast('Lien de connexion envoyé !', 'success');
      } else {
        showToast(data.message || 'Une erreur est survenue.', 'error');
      }
    } catch (error) {
      console.error('Erreur Fetch:', error);
      showToast('Impossible de contacter le serveur.', 'error');
=======
      // ← replaced the entire fetch block with this one line
      await requestMagicLink(email.toLowerCase());
      setLinkSent(true);
      showToast('Magic link send! Please check your mailbox', 'success');
    } catch (error: any) {
      showToast(error.message || 'Something showed up.', 'error');
>>>>>>> upstream/main
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      {/* Custom Toast */}
=======
>>>>>>> upstream/main
      {toast && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981'
            }
          ]}
        >
          <Text style={styles.toastText}>
            {toast.type === 'error' ? '⚠️ ' : '✅ '}
            {toast.message}
          </Text>
        </Animated.View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            {
              paddingTop: insets.top > 0 ? insets.top : 24,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 24
            }
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Bayment</Text>

          {!linkSent ? (
            <>
              <Text style={styles.subtitle}>
<<<<<<< HEAD
                Entrez votre adresse email pour recevoir un lien de connexion.
              </Text>

              <View style={styles.form}>
                <Text style={styles.label}>Adresse e-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Entrer votre adresse e-mail"
=======
                Enter your e-mail address to receive your Magic Link.
              </Text>

              <View style={styles.form}>
                <Text style={styles.label}>E-mail address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your e-mail address"
>>>>>>> upstream/main
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />

                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
<<<<<<< HEAD
                    <Text style={styles.buttonText}>Recevoir un lien de connexion</Text>
=======
                    <Text style={styles.buttonText}>Get your Magic Link</Text>
>>>>>>> upstream/main
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.successIcon}>📧</Text>
              </View>
<<<<<<< HEAD
              <Text style={styles.successTitle}>Lien envoyé !</Text>
              <Text style={styles.successSubtitle}>
                Nous avons envoyé un lien de connexion à : {"\n"}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Text style={styles.instruction}>
                Cliquez sur le lien dans l'email depuis cet appareil pour vous connecter.
=======
              <Text style={styles.successTitle}>Magic Link sent !</Text>
              <Text style={styles.successSubtitle}>
                A Magic Link has been sent to : {"\n"}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Text style={styles.instruction}>
                Click on the link in the e-mail from this device to connect.
>>>>>>> upstream/main
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setLinkSent(false)}
              >
<<<<<<< HEAD
                <Text style={styles.retryText}>Utiliser une autre adresse e-mail</Text>
=======
                <Text style={styles.retryText}>Use another e-mail address</Text>
>>>>>>> upstream/main
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContainer: { padding: 24, flexGrow: 1 },
  backButton: { marginBottom: 16 },
  backText: { color: '#3b82f6', fontSize: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#f8fafc', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 40, paddingHorizontal: 10 },
  form: { width: '100%' },
  label: { color: '#e2e8f0', fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
<<<<<<< HEAD

  // Success state styles
=======
>>>>>>> upstream/main
  successContainer: { alignItems: 'center', marginTop: 20 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center',
    marginBottom: 24, borderWidth: 1, borderColor: '#334155'
  },
  successIcon: { fontSize: 40 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', marginBottom: 16 },
  successSubtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', lineHeight: 24 },
  emailHighlight: { color: '#3b82f6', fontWeight: 'bold' },
  instruction: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 24, fontStyle: 'italic' },
  retryButton: { marginTop: 40 },
  retryText: { color: '#3b82f6', fontSize: 14 },
<<<<<<< HEAD

  // Toast Styles
=======
>>>>>>> upstream/main
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 999,
  },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});