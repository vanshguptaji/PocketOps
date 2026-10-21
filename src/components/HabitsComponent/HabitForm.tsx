import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

import { Habit } from '../../redux/habitSlice';

interface HabitFormProps {
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id'> & { id?: string }) => void;
  initialHabit?: Habit;
}

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';

const FREQUENCY_OPTIONS = ['3X/WEEK', '5X/WEEK', '7X/WEEK'] as const;

const HabitForm = ({ onClose, onSubmit, initialHabit }: HabitFormProps) => {
  const isEditMode = !!initialHabit;
  const [title, setTitle] = useState(initialHabit?.title ?? '');
  const [frequency, setFrequency] = useState<string>(
    initialHabit?.frequency ?? '7X/WEEK'
  );
  const [time, setTime] = useState(initialHabit?.time ?? '');

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      setErrorMsg('⚠ TITLE_REQUIRED — Please enter a habit title');
      return;
    }

    onSubmit({
      ...(isEditMode ? { id: initialHabit!.id } : {}),
      title: title.trim(),
      frequency,
      time: time.trim() || undefined,
      done: initialHabit?.done ?? false,
      streak: initialHabit?.streak ?? 0,
      best: initialHabit?.best ?? 0,
      segments: initialHabit?.segments ?? [false, false, false, false, false, false, false],
      completeDates: initialHabit?.completeDates ?? [],
    });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{isEditMode ? 'EDIT HABIT' : 'NEW HABIT'}</Text>

      {/* Title */}
      <Text style={styles.label}>TITLE *</Text>

      <TextInput
        style={[styles.input, !!errorMsg && styles.inputError]}
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          if (t.trim()) setErrorMsg('');
        }}
        placeholder="e.g. 45MIN_DEEP_WORK"
        placeholderTextColor={MUTED_GREEN}
        autoCapitalize="characters"
        selectionColor={NEON_GREEN}
      />
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      {/* Frequency */}
      <Text style={styles.label}>FREQUENCY</Text>

      <View style={styles.optionsRow}>
        {FREQUENCY_OPTIONS.map(option => (
          <Pressable
            key={option}
            style={[styles.option, frequency === option && styles.optionActive]}
            onPress={() => setFrequency(option)}
          >
            <Text
              style={[
                styles.optionText,
                frequency === option && styles.optionTextActive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Reminder Time */}
      <Text style={styles.label}>REMINDER TIME (OPTIONAL)</Text>

      <TextInput
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="e.g. 05:00"
        placeholderTextColor={MUTED_GREEN}
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </Pressable>

        <Pressable style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addText}>{isEditMode ? 'SAVE CHANGES' : 'ADD HABIT'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
  },

  formTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#DDDDDD',
    fontFamily: 'Courier',
    fontSize: 13,
  },
  inputError: {
    borderColor: '#FF4C4C',
  },
  errorText: {
    color: '#FF4C4C',
    fontFamily: 'Courier',
    fontSize: 11,
    marginTop: 4,
  },

  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },

  optionActive: {
    backgroundColor: NEON_GREEN,
    borderColor: NEON_GREEN,
  },

  optionText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
  },

  optionTextActive: {
    color: '#000000',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },

  cancelText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },

  addButton: {
    flex: 1,
    backgroundColor: NEON_GREEN,
    borderWidth: 1,
    borderColor: NEON_GREEN,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },

  addText: {
    color: '#000000',
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default HabitForm;