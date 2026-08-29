import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTodo,
  Todo,
  Priority,
  removeTodo,
  clearCompletedTodo,
  clearAllTodos,
  setPriority,
  updateTodo, // TODO: make sure this exists in your todoSlice — see note below
} from '../redux/todoSlice';
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

const PRIORITY_CYCLE: Priority[] = ['low', 'medium', 'high'];

const TaskScreen = () => {
  const tasks = useSelector((state: any) => state.todo.todos) as Todo[];
  const [showForm, setShowForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Todo | null>(null);
  const dispatch = useDispatch();

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };
  const handleFormSubmit = (todo: Omit<Todo, 'id'> & { id?: string }) => {
    if (todo.id) {
      dispatch(updateTodo({ ...todo, id: todo.id }));
    } else {
      dispatch(addTodo(todo));
    }
    handleCloseForm();
  };

  const handleRemoveTask = (taskId: string) => {
    dispatch(removeTodo(taskId));
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setEditingTask(task);
    setShowForm(true);
  };
  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    dispatch(updateTodo({ ...task, completed: !task.completed }));
  };
  const handleChangePriority = (taskId: string, currentPriority: Priority) => {
    const nextIndex = (PRIORITY_CYCLE.indexOf(currentPriority) + 1) % PRIORITY_CYCLE.length;
    dispatch(setPriority({ id: taskId, priority: PRIORITY_CYCLE[nextIndex] }));
  };

  // TODO: wire up — open a date picker to set/change due date
  const handleChangeDueDate = (taskId: string) => {
    // setDatePickerTaskId(taskId); setDatePickerVisible(true);
  };

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodo());
  };

  const handleClearAll = () => {
    dispatch(clearAllTodos());
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

        {!showForm && (
          <View style={styles.bulkActionsRow}>
            <Pressable style={styles.bulkActionBtn} onPress={handleClearCompleted}>
              <Text style={styles.bulkActionText}>[ CLEAR COMPLETED ]</Text>
            </Pressable>
            <Pressable style={[styles.bulkActionBtn, styles.bulkActionBtnDanger]} onPress={handleClearAll}>
              <Text style={[styles.bulkActionText, styles.bulkActionTextDanger]}>[ CLEAR ALL ]</Text>
            </Pressable>
          </View>
        )}

        {showForm ? (
          <TaskForm
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            initialTask={editingTask ?? undefined}
          />
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
                      <Pressable onPress={() => handleToggleTask(task.id)}>
                        <Text style={[styles.checkbox, task.completed && styles.checkboxDone]}>
                          {task.completed ? '✓' : '○'}
                        </Text>
                      </Pressable>
                      <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>
                        {task.title}
                      </Text>
                    </View>

                    <View style={styles.taskMetaRow}>
                      <Pressable
                        style={styles.priorityPill}
                        onPress={() => handleChangePriority(task.id, task.priority)}
                      >
                        <View
                          style={[
                            styles.priorityDot,
                            { backgroundColor: PRIORITY_COLORS[task.priority] },
                          ]}
                        />
                        <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
                      </Pressable>

                      <Pressable
                        style={styles.dueBtn}
                        onPress={() => handleChangeDueDate(task.id)}
                      >
                        <Text style={styles.dueText}>
                          {task.dueLabel ? task.dueLabel : 'SET DATE'}
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.taskActionsRow}>
                      <Pressable
                        style={styles.taskActionBtn}
                        onPress={() => handleEditTask(task.id)}
                      >
                        <Text style={styles.taskActionText}>EDIT</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.taskActionBtn, styles.taskActionBtnDanger]}
                        onPress={() => handleRemoveTask(task.id)}
                      >
                        <Text style={[styles.taskActionText, styles.taskActionTextDanger]}>
                          DELETE
                        </Text>
                      </Pressable>
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
    marginBottom: 16,
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
  bulkActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  bulkActionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: MUTED_GREEN,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  bulkActionBtnDanger: {
    borderColor: RED,
  },
  bulkActionText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bulkActionTextDanger: {
    color: RED,
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
    marginBottom: 12,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  dueBtn: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dueText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
  },
  taskActionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    paddingTop: 12,
  },
  taskActionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: MUTED_GREEN,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  taskActionBtnDanger: {
    borderColor: RED,
  },
  taskActionText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  taskActionTextDanger: {
    color: RED,
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