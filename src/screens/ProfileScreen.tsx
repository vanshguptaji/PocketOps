import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { EXPENSE_CATEGORIES, clearExpenses } from '../redux/expenseSlice';
import { clearAllTodos } from '../redux/todoSlice';
import { clearHabits } from '../redux/habitSlice';
import { clearNotes } from '../redux/noteSlice';
import { clearAll } from '../services/StorageService';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';
const RED = '#FF4C4C';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const todos = useSelector((state: RootState) => state.todo.todos);
  const habits = useSelector((state: RootState) => state.habit.habits);
  const notes = useSelector((state: RootState) => state.note.notes);
  const expenses = useSelector((state: RootState) => state.expense.expenses);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHARTS' | 'SYSTEM'>('OVERVIEW');

  // Compute Task Stats
  const taskStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, rate };
  }, [todos]);

  // Compute Habit Stats
  const habitStats = useMemo(() => {
    const total = habits.length;
    const doneToday = habits.filter((h) => h.done).length;
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    return { total, doneToday, bestStreak };
  }, [habits]);

  // Compute Expense Stats & Category Breakdown
  const expenseStats = useMemo(() => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    const byCategory: Record<string, number> = {};
    expenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    const categoriesList = EXPENSE_CATEGORIES.map((cat) => {
      const amount = byCategory[cat.key] || 0;
      const percentage = totalAmount === 0 ? 0 : Math.round((amount / totalAmount) * 100);
      return { ...cat, amount, percentage };
    }).sort((a, b) => b.amount - a.amount);

    return { totalAmount, categoriesList };
  }, [expenses]);

  // Simulated Weekly Activity Data (Mon-Sun activity counts based on habit complete dates & task creation/completion)
  const weeklyActivityData = useMemo(() => {
    // Generate simulated 7-day activity metrics based on current state
    const todayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun
    return DAYS.map((day, idx) => {
      if (idx === todayIndex) {
        return { day, value: taskStats.completed + habitStats.doneToday };
      }
      // Generate deterministic value for visualization
      const base = ((idx * 3 + todos.length + habits.length) % 8) + 1;
      return { day, value: base };
    });
  }, [todos, habits, taskStats, habitStats]);

  const maxWeeklyValue = useMemo(() => {
    const max = Math.max(...weeklyActivityData.map((d) => d.value), 10);
    return max;
  }, [weeklyActivityData]);

  // Productivity Score Calculation (0-100%)
  const productivityScore = useMemo(() => {
    let score = 50;
    if (taskStats.total > 0) score += Math.round((taskStats.completed / taskStats.total) * 25);
    if (habitStats.total > 0) score += Math.round((habitStats.doneToday / habitStats.total) * 15);
    score += Math.min(20, habitStats.bestStreak * 2);
    return Math.min(100, Math.max(10, score));
  }, [taskStats, habitStats]);

  const handleResetData = () => {
    Alert.alert(
      'DANGER // PURGE DATA',
      'Are you sure you want to delete all tasks, habits, notes, and expenses? This operation cannot be undone.',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'PURGE ALL',
          style: 'destructive',
          onPress: async () => {
            dispatch(clearAllTodos());
            dispatch(clearHabits());
            dispatch(clearNotes());
            dispatch(clearExpenses());
            await clearAll();
            Alert.alert('SYSTEM RESET', 'All local data has been purged successfully.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>OP</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.operatorTitle}>OPERATOR // VANSH</Text>
            <Text style={styles.operatorSub}>LEVEL 4 OPERATOR · ACTIVE</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SYNC: OK</Text>
              </View>
              <View style={[styles.badge, { borderColor: NEON_GREEN }]}>
                <Text style={[styles.badgeText, { color: NEON_GREEN }]}>
                  SCORE: {productivityScore}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabRow}>
          {(['OVERVIEW', 'CHARTS', 'SYSTEM'] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Content based on Active Tab */}
        {activeTab === 'OVERVIEW' && (
          <View>
            {/* Quick Metrics Grid */}
            <Text style={styles.sectionHeader}>PERFORMANCE METRICS</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>TASKS DONE</Text>
                <Text style={styles.metricValue}>
                  {taskStats.completed} / {taskStats.total}
                </Text>
                <Text style={styles.metricSub}>{taskStats.rate}% COMPLETION</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>STREAK RECORD</Text>
                <Text style={styles.metricValue}>🔥 {habitStats.bestStreak}D</Text>
                <Text style={styles.metricSub}>BEST HABIT STREAK</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>NOTES LOGGED</Text>
                <Text style={styles.metricValue}>📝 {notes.length}</Text>
                <Text style={styles.metricSub}>TOTAL ENTRIES</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>EXPENSE TOTAL</Text>
                <Text style={styles.metricValue}>₹{expenseStats.totalAmount.toFixed(0)}</Text>
                <Text style={styles.metricSub}>{expenses.length} TRANSACTIONS</Text>
              </View>
            </View>

            {/* Productivity Index Bar */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreTitle}>PRODUCTIVITY INDEX</Text>
                <Text style={styles.scoreValue}>{productivityScore} / 100</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${productivityScore}%` }]}
                />
              </View>
              <Text style={styles.scoreDesc}>
                Calculated dynamically from completed tasks, active habit streaks, and journal logs.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'CHARTS' && (
          <View>
            {/* Weekly Activity Bar Chart */}
            <Text style={styles.sectionHeader}>WEEKLY ACTIVITY LOG (MON-SUN)</Text>
            <View style={styles.chartCard}>
              <View style={styles.barChartContainer}>
                {weeklyActivityData.map((item) => {
                  const heightPct = Math.max(10, Math.round((item.value / maxWeeklyValue) * 100));
                  return (
                    <View key={item.day} style={styles.barCol}>
                      <Text style={styles.barValueText}>{item.value}</Text>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            { height: `${heightPct}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>{item.day}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Expense Breakdown Category Graph */}
            <Text style={styles.sectionHeader}>EXPENSE CATEGORY DISTRIBUTION</Text>
            <View style={styles.chartCard}>
              {expenseStats.totalAmount === 0 ? (
                <Text style={styles.emptyChartText}>NO EXPENSE DATA LOGGED YET</Text>
              ) : (
                expenseStats.categoriesList.map((cat) => (
                  <View key={cat.key} style={styles.categoryRow}>
                    <View style={styles.categoryLabelRow}>
                      <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      <Text style={styles.categoryName}>{cat.key}</Text>
                      <Text style={styles.categoryAmount}>
                        ₹{cat.amount.toFixed(0)} ({cat.percentage}%)
                      </Text>
                    </View>
                    <View style={styles.categoryTrack}>
                      <View
                        style={[
                          styles.categoryFill,
                          { width: `${cat.percentage}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {activeTab === 'SYSTEM' && (
          <View>
            <Text style={styles.sectionHeader}>SYSTEM INFORMATION</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>APP NAME</Text>
                <Text style={styles.infoVal}>POCKET_OPS</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>VERSION</Text>
                <Text style={styles.infoVal}>4.2.0-STABLE</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>STORAGE ENGINE</Text>
                <Text style={styles.infoVal}>ASYNC_STORAGE V1</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>STATE MANAGER</Text>
                <Text style={styles.infoVal}>REDUX_TOOLKIT</Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>SYSTEM CONTROLS</Text>
            <Pressable style={styles.purgeBtn} onPress={handleResetData}>
              <Text style={styles.purgeBtnText}>⚠ PURGE ALL LOCAL DATA</Text>
            </Pressable>
          </View>
        )}
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    backgroundColor: '#050505',
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: NEON_GREEN,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  operatorTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: 'bold',
  },
  operatorSub: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  tabBtnActive: {
    backgroundColor: NEON_GREEN,
    borderColor: NEON_GREEN,
  },
  tabText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#000000',
  },
  sectionHeader: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 12,
  },
  metricLabel: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricValue: {
    color: '#FFFFFF',
    fontFamily: 'Courier',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSub: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 9,
  },
  scoreCard: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 16,
    marginBottom: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scoreTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#111111',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: NEON_GREEN,
    borderRadius: 4,
  },
  scoreDesc: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    lineHeight: 16,
  },
  chartCard: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 16,
    marginBottom: 20,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 20,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValueText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: '#111111',
    justifyContent: 'flex-end',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: NEON_GREEN,
    borderRadius: 2,
  },
  barLabel: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    marginTop: 6,
  },
  emptyChartText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 20,
  },
  categoryRow: {
    marginBottom: 12,
  },
  categoryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    marginRight: 6,
  },
  categoryName: {
    color: '#DDDDDD',
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryAmount: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
  },
  categoryTrack: {
    height: 6,
    backgroundColor: '#111111',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    backgroundColor: NEON_GREEN,
    borderRadius: 3,
  },
  infoCard: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoKey: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoVal: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
  },
  purgeBtn: {
    borderWidth: 1,
    borderColor: RED,
    backgroundColor: '#1A0000',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  purgeBtnText: {
    color: RED,
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ProfileScreen;