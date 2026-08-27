import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';
const RED = '#FF4C4C';
const YELLOW = '#FFD23F';
const GREEN_DOT = '#39FF14';

type Priority = 'high' | 'medium' | 'low';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueLabel: string;
  section: 'Today' | 'Tomorrow';
};

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete React Native project',
    completed: false,
    priority: 'high',
    dueLabel: 'Today',
    section: 'Today',
  },
  {
    id: '2',
    title: 'Solve Binary Search',
    completed: true,
    priority: 'medium',
    dueLabel: 'Today',
    section: 'Today',
  },
  {
    id: '3',
    title: 'Review pull requests',
    completed: false,
    priority: 'medium',
    dueLabel: 'Today',
    section: 'Today',
  },
  {
    id: '4',
    title: 'Apply for frontend internship',
    completed: false,
    priority: 'low',
    dueLabel: 'Aug 26',
    section: 'Tomorrow',
  },
  {
    id: '5',
    title: 'Update resume with new project',
    completed: false,
    priority: 'low',
    dueLabel: 'Aug 26',
    section: 'Tomorrow',
  },
];

const PRIORITY_COLORS: Record<Priority, string> = {
  high: RED,
  medium: YELLOW,
  low: GREEN_DOT,
};

const TaskScreen = () => {
  const navigation = useNavigation();

  const handleAddTask = () => {

  };

  const totalTasks = MOCK_TASKS.length;
  const completedTasks = MOCK_TASKS.filter(t => t.completed).length;

  const sections: Task['section'][] = ['Today', 'Tomorrow'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>TASKS</Text>
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {totalTasks} tasks · {completedTasks} completed
        </Text>

        {/* Filter tabs */}
        <View style={styles.tabsRow}>
          <View style={[styles.tab, styles.tabActive]}>
            <Text style={styles.tabTextActive}>ALL</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>ACTIVE</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>DONE</Text>
          </View>
        </View>

        {/* Sections driven by mock data */}
        {sections.map(section => {
          const sectionTasks = MOCK_TASKS.filter(t => t.section === section);
          if (sectionTasks.length === 0) return null;

          return (
            <View key={section}>
              <Text style={styles.sectionLabel}>{section.toUpperCase()}</Text>

              {sectionTasks.map(task => (
                <View key={task.id} style={styles.taskCard}>
                  <View style={styles.taskTopRow}>
                    <Text style={[styles.checkbox, task.completed && styles.checkboxDone]}>
                      {task.completed ? '✓' : '○'}
                    </Text>
                    <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>
                      {task.title}
                    </Text>
                  </View>
                  <View style={styles.taskMetaRow}>
                    <View style={styles.priorityPill}>
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: PRIORITY_COLORS[task.priority] },
                        ]}
                      />
                      <Text style={styles.priorityText}>
                        {task.priority.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.dueText}>{task.dueLabel}</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Floating add button */}
      <Pressable
        style={styles.fab}
        onPress={handleAddTask}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
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
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: NEON_GREEN,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  searchIcon: {
    fontSize: 18,
  },
  headerSubtitle: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: NEON_GREEN,
    borderColor: NEON_GREEN,
  },
  tabText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#000000',
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionLabel: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
  },
  taskCard: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 16,
    width: 24,
  },
  checkboxDone: {
    color: NEON_GREEN,
  },
  taskTitle: {
    color: '#DDDDDD',
    fontFamily: 'Courier',
    fontSize: 14,
    flexShrink: 1,
  },
  taskTitleDone: {
    color: MUTED_GREEN,
    textDecorationLine: 'line-through',
  },
  taskMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    color: '#AAAAAA',
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dueText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NEON_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NEON_GREEN,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  fabIcon: {
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 30,
  },
});

export default TaskScreen;