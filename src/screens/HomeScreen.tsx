import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const ORANGE = '#FFA500';
const BORDER_GRAY = '#1A1A1A';

const ProgressBar = ({ value, total }: { value: number; total: number }) => {
  const pct = total === 0 ? 0 : Math.min(100, (value / total) * 100);
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [time, setTime] = useState(new Date());

  const todos = useSelector((state: RootState) => state.todo.todos);
  const habits = useSelector((state: RootState) => state.habit.habits);
  const notes = useSelector((state: RootState) => state.note.notes);
  const expenses = useSelector((state: RootState) => state.expense.expenses);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute live stats
  const tasksDone = todos.filter((t) => t.completed).length;
  const tasksTotal = todos.length;

  const habitsDone = habits.filter((h) => h.done).length;
  const habitsTotal = habits.length;

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

  const todayStr = time.toISOString().split('T')[0];
  const todaySpend = expenses
    .filter((e) => e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const dateStr = time.toLocaleDateString(undefined, {
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
        <Text style={styles.dateText}>{dateStr}</Text>

        {/* 4 Summary cards */}
        <View style={styles.statsGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TASKS</Text>
            <Text style={styles.summaryValue}>
              {tasksDone}/{tasksTotal}
            </Text>
            <ProgressBar value={tasksDone} total={tasksTotal} />
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>HABITS</Text>
            <Text style={styles.summaryValue}>
              {habitsDone}/{habitsTotal}
            </Text>
            <ProgressBar value={habitsDone} total={habitsTotal} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>NOTES</Text>
            <Text style={styles.summaryValue}>{notes.length}</Text>
            <Text style={styles.subtext}>LOG ENTRIES</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TODAY'S SPEND</Text>
            <Text style={styles.summaryValue}>₹{todaySpend.toFixed(0)}</Text>
            <Text style={styles.subtext}>INR TOTAL</Text>
          </View>
        </View>

        {/* Today's tasks */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionHeader}>TODAY'S TASKS</Text>
        </View>

        <View style={styles.taskList}>
          {todos.length === 0 ? (
            <View style={styles.emptyTaskCard}>
              <Text style={styles.emptyTaskText}>NO PENDING TASKS</Text>
            </View>
          ) : (
            todos.slice(0, 5).map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <Text
                  style={[
                    styles.taskIcon,
                    task.completed && styles.taskIconDone,
                  ]}
                >
                  {task.completed ? '✓' : '○'}
                </Text>
                <Text
                  style={[
                    styles.taskLabel,
                    task.completed && styles.taskLabelDone,
                    task.priority === 'high' && styles.taskLabelCritical,
                  ]}
                >
                  {task.title}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Streak card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakTitle}>{bestStreak} Day Streak</Text>
            <Text style={styles.streakSubtitle}>Keep the chain alive</Text>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.quickActionsLabel}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tasks')}
          >
            <Text style={styles.actionButtonText}>+ TASK</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Habit')}
          >
            <Text style={styles.actionButtonText}>+ HABIT</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Notes')}
          >
            <Text style={styles.actionButtonText}>+ NOTE</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Expense')}
          >
            <Text style={styles.actionButtonText}>+ EXPENSE</Text>
          </Pressable>
        </View>

        {/* Terminal prompt */}
        <View style={styles.terminalPrompt}>
          <Text style={styles.terminalText}>
            <Text style={styles.mutedText}>~$ </Text>pocketops ready
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
    paddingBottom: 30,
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  subtext: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
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
    marginTop: 12,
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
  emptyTaskCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    alignItems: 'center',
  },
  emptyTaskText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: NEON_GREEN,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
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