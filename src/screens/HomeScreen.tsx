import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';

const HomeScreen = () => {
  const tasks = [
    {
      id: '1',
      title: 'Complete React Native',
      completed: true,
    },
    {
      id: '2',
      title: 'Solve Binary Search',
      completed: false,
    },
    {
      id: '3',
      title: 'Apply to 2 jobs',
      completed: false,
    },
  ];
  const habits = {
    completed: 5,
    total: 7,
  };
  const streak = 7;

  const date = new Date().toDateString();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning 👋";
    } else if (hour < 18) {
      return "Good afternoon 👋";
    } else {
      return "Good evening 👋";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.Greetings}>{`> ${getGreeting()}`}</Text>
        <Text style={styles.mutedText}>{`// ${date}`}</Text>

        <View style={styles.StatsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.label}>[TASKS]</Text>
            <Text style={styles.value}>
              {tasks.filter(task => task.completed).length} / {tasks.length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.label}>[HABITS]</Text>
            <Text style={styles.value}>{habits.completed} / {habits.total}</Text>
          </View>
        </View>

        <View style={styles.TasksContainer}>
          <Text style={styles.Greetings}>[TASKS]</Text>
          {tasks.map(task => (
            <View key={task.id} style={styles.card}>
              <Text style={styles.taskTitle}>{`$ ${task.title}`}</Text>
              <Text style={task.completed ? styles.value : styles.mutedText}>
                {task.completed ? '[DONE]' : '[PENDING]'}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.StreakText}>{`>> Streak: ${streak} days`}</Text>

        <View style={styles.QuickActionsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.value}>{'>'} + Add Task_</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.value}>{'>'} + Add Habit_</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const NEON_GREEN = '#39FF14';

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
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 48,
  },
  Greetings: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: NEON_GREEN,
    fontFamily: 'Courier',
    textShadowColor: NEON_GREEN,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  mutedText: {
    color: '#2E8B2E',
    fontFamily: 'Courier',
    fontSize: 13,
  },
  label: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  value: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 15,
    fontWeight: 'bold',
  },
  taskTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 14,
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    padding: 16,
    marginVertical: 8,
    width: '90%',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 6,
  },
  StatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  TasksContainer: {
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  StreakText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: NEON_GREEN,
    fontFamily: 'Courier',
  },
  QuickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
});

export default HomeScreen;