import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { hydrateStore, startPersistence } from '../services/PersistenceManager';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';

const BOOT_LOGS = [
  '> INITIALIZING POCKET_OPS CORE...',
  '> LOADING DATA MODULES...',
  '> PERSISTENCE STORAGE... [OK]',
  '> SYSTEM INTEGRITY CHECK... [OK]',
  '> CORE_OS V4.2 READY',
  '> WELCOME, OPERATOR.',
];

export const SplashScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [logs, setLogs] = useState<string[]>([]);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Blinking cursor animation
    const cursorAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    cursorAnim.start();

    // Hydrate store from AsyncStorage
    let isMounted = true;

    async function initApp() {
      await hydrateStore(dispatch);
      startPersistence();
    }

    initApp();

    // Typing boot log sequence
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_LOGS.length) {
        if (isMounted) {
          setLogs((prev) => [...prev, BOOT_LOGS[currentLine]]);
        }
        currentLine++;
      } else {
        clearInterval(interval);
        // After sequence finishes, navigate to main app
        setTimeout(() => {
          if (isMounted) {
            if (navigation && typeof navigation.reset === 'function') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            } else if (navigation && typeof navigation.navigate === 'function') {
              navigation.navigate('MainTabs');
            }
          }
        }, 600);
      }
    }, 300);

    return () => {
      isMounted = false;
      cursorAnim.stop();
      clearInterval(interval);
    };
  }, [dispatch, navigation, cursorOpacity]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerBox}>
          <Text style={styles.brandTitle}>POCKET_OPS</Text>
          <Text style={styles.brandSubtitle}>SYSTEM BOOT // V4.2</Text>
        </View>

        <View style={styles.logContainer}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))}
          <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  headerBox: {
    marginBottom: 40,
    alignItems: 'center',
  },
  brandTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 3,
    textShadowColor: NEON_GREEN,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
    marginBottom: 6,
  },
  brandSubtitle: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    letterSpacing: 2,
  },
  logContainer: {
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 4,
    padding: 20,
    minHeight: 220,
  },
  logText: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 13,
    lineHeight: 24,
  },
  cursor: {
    width: 10,
    height: 16,
    backgroundColor: NEON_GREEN,
    marginTop: 6,
  },
});

export default SplashScreen;
