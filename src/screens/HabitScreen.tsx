import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import Navigation from '../components/Nvigation'

const GREEN = '#39FF14'
const GREEN_DIM = '#1F7A0E'
const GREEN_FAINT = 'rgba(57, 255, 20, 0.15)'
const BG = '#000000'
const BORDER = 'rgba(57, 255, 20, 0.35)'

type Habit = {
  id: string
  name: string
  done: boolean
  streak: number
  best: number
  frequency: string
  time?: string
  segments: boolean[] 
}

const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: '05:00AM_WAKEUP',
    done: true,
    streak: 14,
    best: 21,
    frequency: '7X/WEEK',
    time: '05:00',
    segments: Array(21).fill(true),
  },
  {
    id: '2',
    name: '45MIN_DEEP_WORK',
    done: false,
    streak: 3,
    best: 12,
    frequency: '5X/WEEK',
    time: '09:30',
    segments: [
      true, true, true, true, false, false, false,
      true, true, true, true, true, true, false,
      false, false, false, false, false, false, false,
    ],
  },
  {
    id: '3',
    name: 'HYDRATE_2L',
    done: false,
    streak: 28,
    best: 28,
    frequency: '7X/WEEK',
    segments: Array(21).fill(true),
  },
  {
    id: '4',
    name: 'READ_20_PAGES',
    done: false,
    streak: 7,
    best: 9,
    frequency: '7X/WEEK',
    time: '21:00',
    segments: [
      true, true, true, true, false, false, false,
      true, false, false, false, false, false, false,
      true, true, false, false, false, false, false,
    ],
  },
  {
    id: '5',
    name: 'EVENING_RUN_5K',
    done: false,
    streak: 5,
    best: 15,
    frequency: '3X/WEEK',
    time: '18:00',
    segments: [
      true, true, true, false, false, false, false,
      false, true, false, false, false, false, false,
      true, true, true, false, false, false, false,
    ],
  },
]

const SegmentBar = ({ segments }: { segments: boolean[] }) => (
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
)

const HabitCard = ({
  habit,
  onToggle,
}: {
  habit: Habit
  onToggle: (id: string) => void
}) => (
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
        <Text style={styles.habitName}>{habit.name}</Text>
      </TouchableOpacity>

      <View style={styles.cardTopRight}>
        <Text style={styles.streakText}>{habit.streak}d</Text>
        <TouchableOpacity style={styles.editButton} activeOpacity={0.6}>
          <Text style={styles.editButtonText}>EDIT</Text>
        </TouchableOpacity>
      </View>
    </View>

    <SegmentBar segments={habit.segments} />

    <View style={styles.cardFooter}>
      <Text style={styles.footerText}>BEST {habit.best}D</Text>
      <Text style={styles.footerText}>{habit.frequency}</Text>
      {habit.time && (
        <Text style={styles.footerText}>⏰ {habit.time}</Text>
      )}
    </View>
  </View>
)

const HabitScreen = () => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS)
  const [time] = useState('09:47:40')

  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, done: !h.done } : h)),
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>CORE_OS // V4.2</Text>
          <Text style={styles.headerTime}>{time}</Text>
        </View>
        <Text style={styles.headerStats}>
          CPU 12%   MEM 4.2/16GB   SYNC OK
        </Text>
      </View>

      {/* Section title */}
      <View style={styles.sectionRow}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.dot} />
          <Text style={styles.sectionTitle}>ACTIVE_HABITS.LOG</Text>
        </View>
        <Text style={styles.sectionCount}>1/{habits.length}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.newHabitButton} activeOpacity={0.6}>
          <Text style={styles.newHabitText}>+ NEW HABIT</Text>
        </TouchableOpacity>

        {habits.map(h => (
          <HabitCard key={h.id} habit={h} onToggle={toggleHabit} />
        ))}
      </ScrollView>
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
})

export default HabitScreen