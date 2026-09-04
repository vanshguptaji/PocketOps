import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Modal,
  Vibration,
  ListRenderItemInfo,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import HabitForm from '../components/HabitsComponent/HabitForm'
import {
  Habit,
  toggleHabit,
  addHabit,
  editHabit,
  removeHabit,
} from '../redux/habitSlice'
import type { RootState } from '../redux/store'

const GREEN = '#39FF14'
const GREEN_DIM = '#1F7A0E'
const RED = '#FF4C4C'
const BG = '#000000'
const BORDER = 'rgba(57, 255, 20, 0.35)'
const CARD_HEIGHT = 120 // includes swipeableContainer marginBottom — remeasure if styles change

const SegmentBar = React.memo(({ segments }: { segments: boolean[] }) => (
  <View style={styles.segmentRow}>
    {segments.map((filled, i) => (
      <View
        key={i}
        style={[
          styles.segment,
          { backgroundColor: filled ? GREEN : 'rgba(57,255,20,0.08)' },
        ]}
      />
    ))}
  </View>
))

// Same delete-action pattern as TaskScreen: renderRightActions gets (progress, drag)
// shared values from reanimated-gesture-handler; we translate based on drag.value.
const renderDeleteAction =
  (habitId: string, onDelete: (id: string) => void) =>
  (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 90 }],
    }))

    return (
      <Reanimated.View style={[styles.deleteAction, styleAnimation]}>
        <Pressable
          style={styles.deleteActionInner}
          onPress={() => onDelete(habitId)}
          hitSlop={8}
        >
          <Text style={styles.deleteActionGlyph}>✕</Text>
          <Text style={styles.deleteActionText}>DELETE</Text>
        </Pressable>
      </Reanimated.View>
    )
  }

type CardProps = {
  habit: Habit
  onToggle: (id: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
}

const HabitCard = React.memo(
  ({ habit, onToggle, onEdit, onDelete }: CardProps) => (
    <ReanimatedSwipeable
      containerStyle={styles.swipeableContainer}
      friction={2}
      rightThreshold={90}
      overshootRight={false}
      renderRightActions={renderDeleteAction(habit.id, onDelete)}
      onSwipeableOpen={direction => {
        if (direction === 'right') {
          Vibration.vibrate(10)
          onDelete(habit.id)
        }
      }}
    >
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => onToggle(habit.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.checkbox, habit.done && styles.checkboxDone]}>
              [{habit.done ? 'X' : ' '}]
            </Text>
            <Text style={styles.habitName}>{habit.title}</Text>
          </TouchableOpacity>

          <View style={styles.cardTopRight}>
            <Text style={styles.streakText}>{habit.streak}d</Text>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.6}
              onPress={() => onEdit(habit)}
            >
              <Text style={styles.editButtonText}>EDIT</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SegmentBar segments={habit.segments} />

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>BEST {habit.best}D</Text>
          <Text style={styles.footerText}>{habit.frequency}</Text>
          {habit.time && <Text style={styles.footerText}>⏰ {habit.time}</Text>}
        </View>
      </View>
    </ReanimatedSwipeable>
  ),
  (prev, next) =>
    prev.habit === next.habit &&
    prev.onToggle === next.onToggle &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete,
)

const HabitScreen = () => {
  const habits = useSelector((state: RootState) => state.habit.habits)
  const dispatch = useDispatch()
  const [time] = useState('09:47:40')

  const [formVisible, setFormVisible] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined)

  const doneCount = habits.filter((h: Habit) => h.done).length

  const handleToggle = useCallback((id: string) => dispatch(toggleHabit(id)), [dispatch])

  const handleOpenEdit = useCallback((habit: Habit) => {
    setEditingHabit(habit)
    setFormVisible(true)
  }, [])

  const handleOpenNew = useCallback(() => {
    setEditingHabit(undefined)
    setFormVisible(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setFormVisible(false)
    setEditingHabit(undefined)
  }, [])

  const handleSubmit = useCallback(
    (habit: Omit<Habit, 'id'> & { id?: string }) => {
      if (habit.id) {
        dispatch(editHabit(habit as Habit))
      } else {
        dispatch(addHabit(habit))
      }
      setFormVisible(false)
      setEditingHabit(undefined)
    },
    [dispatch],
  )

  const handleDelete = useCallback((id: string) => dispatch(removeHabit(id)), [dispatch])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Habit>) => (
      <HabitCard
        habit={item}
        onToggle={handleToggle}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
    ),
    [handleToggle, handleOpenEdit, handleDelete],
  )

  const keyExtractor = useCallback((item: Habit) => item.id, [])

  const getItemLayout = useCallback(
    (_: ArrayLike<Habit> | null | undefined, index: number) => ({
      length: CARD_HEIGHT,
      offset: CARD_HEIGHT * index,
      index,
    }),
    [],
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>CORE_OS // V4.2</Text>
          <Text style={styles.headerTime}>{time}</Text>
        </View>
        <Text style={styles.headerStats}>CPU 12%   MEM 4.2/16GB   SYNC OK</Text>
      </View>

      <View style={styles.sectionRow}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.dot} />
          <Text style={styles.sectionTitle}>ACTIVE_HABITS.LOG</Text>
        </View>
        <Text style={styles.sectionCount}>
          {doneCount}/{habits.length}
        </Text>
      </View>

      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        data={habits}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.newHabitButton}
            activeOpacity={0.6}
            onPress={handleOpenNew}
          >
            <Text style={styles.newHabitText}>+ NEW HABIT</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={<Text style={styles.footerText}>NO HABITS TRACKED YET</Text>}
      />

      <Modal visible={formVisible} animationType="slide" transparent onRequestClose={handleCloseForm}>
        <View style={styles.modalOverlay}>
          <HabitForm
            onClose={handleCloseForm}
            onSubmit={handleSubmit}
            initialHabit={editingHabit}
          />
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    borderWidth: 1,
    borderColor: BORDER,
    borderBottomWidth: 0,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: GREEN,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  headerTime: {
    color: GREEN_DIM,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  headerStats: {
    color: GREEN_DIM,
    fontFamily: 'monospace',
    fontSize: 11,
    marginTop: 6,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderTopWidth: 0,
    marginHorizontal: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: GREEN,
    marginRight: 8,
  },
  sectionTitle: {
    color: GREEN,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  sectionCount: {
    color: GREEN_DIM,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  scroll: {
    flex: 1,
    marginHorizontal: 12,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  newHabitButton: {
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: 'dashed',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  newHabitText: {
    color: GREEN_DIM,
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  checkbox: {
    color: GREEN_DIM,
    fontFamily: 'monospace',
    fontSize: 13,
    marginRight: 6,
  },
  checkboxDone: {
    color: '#FFB020',
  },
  habitName: {
    color: GREEN,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    color: GREEN_DIM,
    fontFamily: 'monospace',
    fontSize: 12,
    marginRight: 10,
  },
  editButton: {
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  editButtonText: {
    color: GREEN_DIM,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: 10,
  },
  segment: {
    width: 14,
    height: 6,
    borderRadius: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  footerText: {
    color: GREEN_DIM,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  terminalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  terminalPrompt: {
    color: '#FFB020',
    fontFamily: 'monospace',
    fontSize: 12,
    flex: 1,
  },
  cursor: {
    width: 2,
    height: 14,
    backgroundColor: GREEN,
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
    marginLeft: -1,
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
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: RED,
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 0 },
  },
  deleteActionText: {
    color: RED,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
})
export default HabitScreen
