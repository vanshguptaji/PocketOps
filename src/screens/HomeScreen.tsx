import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Navigation from '../components/Nvigation';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const ORANGE = '#FFA500';
const BORDER_GRAY = '#1A1A1A';

type Task = {
  id: string;
  label: string;
  status: 'done' | 'pending' | 'critical';
};

const ProgressBar = ({ value, total }: { value: number; total: number }) => {
  const pct = total === 0 ? 0 : (value / total) * 100;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [time, setTime] = useState(new Date());
  const route = useRoute();
  console.log('Current route:', route.name);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const tasks: Task[] = [
    { id: '1', label: 'PROCESS_MAIL_INBOX', status: 'done' },
    { id: '2', label: 'REVIEW_SYSTEM_ARCHITECT_DOCS', status: 'pending' },
    { id: '3', label: 'CRITICAL_PATCH_DEPLOYMENT', status: 'critical' },
    { id: '4', label: 'SYNC_WITH_DATABASE_TEAM', status: 'pending' },
    { id: '5', label: 'END_OF_DAY_LOGOUT', status: 'pending' },
  ];

  const habitsDone = 1;
  const habitsTotal = 5;
  const tasksDone = tasks.filter(t => t.status === 'done').length;
  const streak = 28;

  const date = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const timeString = time.toLocaleTimeString(undefined, { hour12: false });

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* System status bar */}
        <View style={styles.statusRow}>
          <Text style={styles.statusTitle}>CORE_OS // V4.2</Text>
          <Text style={styles.statusTime}>{timeString}</Text>
        </View>
        <Text style={styles.statusSubline}>CPU 12%   MEM 4.2/16GB   SYNC OK</Text>
        <View style={styles.divider} />

        {/* Greeting */}
        <Text style={styles.greeting}>{getGreeting()} 👋</Text>
        <Text style={styles.dateText}>{date}</Text>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TASKS</Text>
            <Text style={styles.summaryValue}>{tasksDone}/{tasks.length}</Text>
            <ProgressBar value={tasksDone} total={tasks.length} />
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>HABITS</Text>
            <Text style={styles.summaryValue}>{habitsDone}/{habitsTotal}</Text>
            <ProgressBar value={habitsDone} total={habitsTotal} />
          </View>
        </View>

        {/* Today's tasks */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionHeader}>TODAY'S TASKS</Text>
        </View>

        <View style={styles.taskList}>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskRow}>
              <Text
                style={[
                  styles.taskIcon,
                  task.status === 'done' && styles.taskIconDone,
                ]}
              >
                {task.status === 'done' ? '✓' : '○'}
              </Text>
              <Text
                style={[
                  styles.taskLabel,
                  task.status === 'done' && styles.taskLabelDone,
                  task.status === 'critical' && styles.taskLabelCritical,
                ]}
              >
                {task.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Streak card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakTitle}>{streak} Day Streak</Text>
            <Text style={styles.streakSubtitle}>Keep the chain alive</Text>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.quickActionsLabel}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsRow}>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tasks' as never)}
          >
            <Text style={styles.actionButtonText}>+ TASK</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Habit' as never)}
          >
            <Text style={styles.actionButtonText}>+ HABIT</Text>
          </Pressable>
        </View>

        {/* Terminal prompt */}
        <View style={styles.terminalPrompt}>
          <Text style={styles.terminalText}>
            <Text style={styles.mutedText}>~$ </Text>type 'help'
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusTime: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
  },
  statusSubline: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_GRAY,
    marginVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NEON_GREEN,
    fontFamily: 'Courier',
    textShadowColor: NEON_GREEN,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  dateText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 14,
  },
  summaryLabel: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    marginBottom: 6,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontFamily: 'Courier',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#111111',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: NEON_GREEN,
    borderRadius: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionDot: {
    width: 8,
    height: 8,
    backgroundColor: NEON_GREEN,
    marginRight: 8,
  },
  sectionHeader: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  taskList: {
    marginBottom: 24,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  taskIcon: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 14,
    width: 20,
  },
  taskIconDone: {
    color: NEON_GREEN,
  },
  taskLabel: {
    color: '#DDDDDD',
    fontFamily: 'Courier',
    fontSize: 13,
    flexShrink: 1,
  },
  taskLabelDone: {
    color: MUTED_GREEN,
    textDecorationLine: 'line-through',
  },
  taskLabelCritical: {
    color: ORANGE,
    fontWeight: 'bold',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
    gap: 14,
  },
  streakEmoji: {
    fontSize: 26,
  },
  streakTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 15,
    fontWeight: 'bold',
  },
  streakSubtitle: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    marginTop: 2,
  },
  quickActionsLabel: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 10,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: NEON_GREEN,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 13,
    fontWeight: 'bold',
  },
  terminalPrompt: {
    marginTop: 4,
  },
  terminalText: {
    color: '#DDDDDD',
    fontFamily: 'Courier',
    fontSize: 13,
  },
  mutedText: {
    color: MUTED_GREEN,
  },
});

export default HomeScreen;