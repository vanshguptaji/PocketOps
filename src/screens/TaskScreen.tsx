import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, Todo, Priority } from '../redux/todoSlice';
import TaskForm from '../components/TasksComponent/TasksForm';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';
const RED = '#FF4C4C';
const YELLOW = '#FFD23F';
const GREEN_DOT = '#39FF14';

const PRIORITY_COLORS: Record<Priority, string> = {
  high: RED,
  medium: YELLOW,
  low: GREEN_DOT,
};

const TaskScreen = () => {
  const tasks = useSelector((state: any) => state.todo.todos) as Todo[];
  const [showForm, setShowForm] = React.useState(false);
  const dispatch = useDispatch();

  const handleAddTask = (todo: Omit<Todo, 'id'>) => {
    dispatch(addTodo(todo));
    setShowForm(false);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  const sections: Todo['section'][] = ['Today', 'Tomorrow'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>TASKS</Text>
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {totalTasks} tasks · {completedTasks} completed
        </Text>

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

        {showForm ? (
          <TaskForm onClose={() => setShowForm(false)} onSubmit={handleAddTask} />
        ) : (
          sections.map(section => {
            const sectionTasks = tasks.filter(t => t.section === section);
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
                        <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.dueText}>{task.dueLabel}</Text>
                    </View>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      {!showForm && (
        <Pressable style={styles.fab} onPress={() => setShowForm(true)}>
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>
      )}
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