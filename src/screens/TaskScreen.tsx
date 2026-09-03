import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  TextInput,
  FlatList,
  Dimensions,
  Vibration,
} from 'react-native';
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
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

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

type FilterTab = 'all' | 'active' | 'done';

// Splits an array into chunks of `size` — used to page 3 tasks per horizontal "page"
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const TaskScreen = () => {
  const tasks = useSelector((state: any) => state.todo.todos) as Todo[];
  const [showForm, setShowForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Todo | null>(null);
  const [filter, setFilter] = React.useState<FilterTab>('all');
  const [searchText, setSearchText] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const dispatch = useDispatch();
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  // Width of a single "page" inside the horizontal pager — matches the
  // container's horizontal padding (20 on each side) from contentContainer
  const PAGE_WIDTH = SCREEN_WIDTH - 40;

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
    const nextIndex =
      (PRIORITY_CYCLE.indexOf(currentPriority) + 1) % PRIORITY_CYCLE.length;
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

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };
  const handleFocusOff = () => {
    setIsSearchFocused(false);
    setSearchText('');
  };
  const handleBlur = () => {
    //something
  };

  const filteredTasks = React.useMemo(() => {
    let result = tasks;

    if (filter === 'active') result = result.filter(t => !t.completed);
    else if (filter === 'done') result = result.filter(t => t.completed);

    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(query));
    }

    return result;
  }, [tasks, filter, searchText]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  const sections: Todo['section'][] = ['Today', 'Tomorrow'];

  const renderDeleteAction =
    (taskId: string) =>
    (prog: SharedValue<number>, drag: SharedValue<number>) => {
      const styleAnimation = useAnimatedStyle(() => ({
        transform: [{ translateX: drag.value + 90 }],
      }));

      return (
        <Reanimated.View style={[styles.deleteAction, styleAnimation]}>
          <Pressable
            style={styles.deleteActionInner}
            onPress={() => handleRemoveTask(taskId)}
            hitSlop={8}
          >
            <Text style={styles.deleteActionGlyph}>✕</Text>
            <Text style={styles.deleteActionText}>DELETE</Text>
          </Pressable>
        </Reanimated.View>
      );
    };

  // const renderTaskCard = (task: Todo) => (
  //   <View key={task.id} style={styles.taskCard}>
  //     <View style={styles.taskTopRow}>
  //       <Pressable onPress={() => handleToggleTask(task.id)}>
  //         <Text
  //           style={[
  //             styles.checkbox,
  //             task.completed && styles.checkboxDone,
  //           ]}
  //         >
  //           {task.completed ? '✓' : '○'}
  //         </Text>
  //       </Pressable>
  //       <Text
  //         style={[
  //           styles.taskTitle,
  //           task.completed && styles.taskTitleDone,
  //         ]}
  //       >
  //         {task.title}
  //       </Text>
  //     </View>

  //     <View style={styles.taskMetaRow}>
  //       <Pressable
  //         style={styles.priorityPill}
  //         onPress={() => handleChangePriority(task.id, task.priority)}
  //       >
  //         <View
  //           style={[
  //             styles.priorityDot,
  //             { backgroundColor: PRIORITY_COLORS[task.priority] },
  //           ]}
  //         />
  //         <Text style={styles.priorityText}>
  //           {task.priority.toUpperCase()}
  //         </Text>
  //       </Pressable>

  //       <Pressable
  //         style={styles.dueBtn}
  //         onPress={() => handleChangeDueDate(task.id)}
  //       >
  //         <Text style={styles.dueText}>
  //           {task.dueLabel ? task.dueLabel : 'SET DATE'}
  //         </Text>
  //       </Pressable>
  //     </View>

  //     <View style={styles.taskActionsRow}>
  //       <Pressable
  //         style={styles.taskActionBtn}
  //         onPress={() => handleEditTask(task.id)}
  //       >
  //         <Text style={styles.taskActionText}>EDIT</Text>
  //       </Pressable>
  //       <Pressable
  //         style={[styles.taskActionBtn, styles.taskActionBtnDanger]}
  //         onPress={() => handleRemoveTask(task.id)}
  //       >
  //         <Text style={[styles.taskActionText, styles.taskActionTextDanger]}>
  //           DELETE
  //         </Text>
  //       </Pressable>
  //     </View>
  //   </View>
  // );

  const renderTaskCard = (task: Todo) => (
    <ReanimatedSwipeable
      key={task.id}
      containerStyle={styles.swipeableContainer}
      friction={2}
      rightThreshold={90}
      overshootRight={false}
      renderRightActions={renderDeleteAction(task.id)}
      onSwipeableOpen={direction => {
        if (direction === 'right') {
          handleRemoveTask(task.id);
        }
      }}
    >
      <Pressable
      onLongPress={() => {Vibration.vibrate(10); handleEditTask(task.id);}}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.taskCard,
        pressed && styles.taskCardPressed,
      ]}
    >
      <View style={styles.taskCard}>
        <View style={styles.taskTopRow}>
          <Pressable onPress={() => handleToggleTask(task.id)}>
            <Text
              style={[styles.checkbox, task.completed && styles.checkboxDone]}
            >
              {task.completed ? '✓' : '○'}
            </Text>
          </Pressable>
          <Text
            style={[styles.taskTitle, task.completed && styles.taskTitleDone]}
          >
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
            <Text style={styles.priorityText}>
              {task.priority.toUpperCase()}
            </Text>
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
        </View>
      </View>
      </Pressable>
    </ReanimatedSwipeable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>TASKS</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {totalTasks} tasks · {completedTasks} completed
        </Text>
        <View
          style={[
            styles.searchWrapper,
            isSearchFocused && styles.searchWrapperFocused,
          ]}
        >
          <Text style={styles.searchPrompt}>{'>'}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="search tasks..."
            placeholderTextColor={MUTED_GREEN}
            value={searchText}
            onChangeText={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            returnKeyLabel="Search"
            submitBehavior="blurAndSubmit"
            onBlur={handleBlur}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={NEON_GREEN}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => handleFocusOff()} hitSlop={8}>
              <Text style={styles.searchClear}>×</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tab, filter === 'all' && styles.tabActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={filter === 'all' ? styles.tabTextActive : styles.tabText}
            >
              ALL
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, filter === 'active' && styles.tabActive]}
            onPress={() => setFilter('active')}
          >
            <Text
              style={
                filter === 'active' ? styles.tabTextActive : styles.tabText
              }
            >
              ACTIVE
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, filter === 'done' && styles.tabActive]}
            onPress={() => setFilter('done')}
          >
            <Text
              style={filter === 'done' ? styles.tabTextActive : styles.tabText}
            >
              DONE
            </Text>
          </Pressable>
        </View>

        {!showForm && (
          <View style={styles.bulkActionsRow}>
            <Pressable
              style={styles.bulkActionBtn}
              onPress={handleClearCompleted}
            >
              <Text style={styles.bulkActionText}>[ CLEAR COMPLETED ]</Text>
            </Pressable>
            <Pressable
              style={[styles.bulkActionBtn, styles.bulkActionBtnDanger]}
              onPress={handleClearAll}
            >
              <Text
                style={[styles.bulkActionText, styles.bulkActionTextDanger]}
              >
                [ CLEAR ALL ]
              </Text>
            </Pressable>
          </View>
        )}

        {!showForm && filteredTasks.length === 0 && (
          <Text style={styles.emptyStateText}>
            {filter === 'done'
              ? 'NO COMPLETED TASKS'
              : filter === 'active'
              ? 'NO ACTIVE TASKS'
              : 'NO TASKS YET'}
          </Text>
        )}

        {showForm ? (
          <TaskForm
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            initialTask={editingTask ?? undefined}
          />
        ) : (
          sections.map(section => {
            const tasksFiltered = filteredTasks.filter(
              t => t.section === section,
            );
            if (tasksFiltered.length === 0) return null;
            const pages = chunkArray(tasksFiltered, 3);

            return (
              <View key={section}>
                <Text style={styles.sectionLabel}>{section.toUpperCase()}</Text>
                <FlatList
                  data={pages}
                  horizontal
                  pagingEnabled
                  keyExtractor={(_, index) => `${section}-page-${index}`}
                  renderItem={({ item: pageItems }) => (
                    <View style={{ width: PAGE_WIDTH }}>
                      {pageItems.map(task => renderTaskCard(task))}
                    </View>
                  )}
                />
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 16,
  },
  searchWrapperFocused: {
    borderColor: NEON_GREEN,
    shadowColor: NEON_GREEN,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  searchPrompt: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#DDDDDD',
    fontFamily: 'Courier',
    fontSize: 13,
    padding: 0,
    height: '100%',
  },
  searchClear: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 4,
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
    // marginBottom: 12,
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
  emptyStateText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
    letterSpacing: 0.5,
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
  swipeableContainer: {
    marginBottom: 12,
    borderRadius: 4,
    overflow: 'hidden',
  },
  deleteAction: {
    width: 90,
    backgroundColor: '#1A0000',
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -1, // sits flush against the card's right edge
  },
  deleteActionInner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  deleteActionGlyph: {
    color: RED,
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: RED,
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 0 },
  },
  deleteActionText: {
    color: RED,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  taskCardPressed: {
    borderColor: NEON_GREEN,
    backgroundColor: '#0A0A0A',
  },
});

export default TaskScreen;
