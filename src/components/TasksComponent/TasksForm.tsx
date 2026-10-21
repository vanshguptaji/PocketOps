import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

import { Todo, Priority } from '../../redux/todoSlice';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (todo: Omit<Todo, 'id'> & { id?: string }) => void;
  initialTask?: Todo;
}

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';

const TaskForm = ({ onClose, onSubmit, initialTask }: TaskFormProps) => {
  const isEditMode = !!initialTask;
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? 'low');
  const [dueLabel, setDueLabel] = useState(initialTask?.dueLabel ?? '');
  const [section, setSection] = useState<'Today' | 'Tomorrow'>(
    initialTask?.section ?? 'Today'
  );

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      setErrorMsg('⚠ TITLE_REQUIRED — Please enter a task title');
      return;
    }

    onSubmit({
      ...(isEditMode ? { id: initialTask!.id } : {}),
      title: title.trim(),
      priority,
      dueLabel: dueLabel.trim(),
      section,
      completed: initialTask?.completed ?? false,
    });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{isEditMode ? 'EDIT TASK' : 'NEW TASK'}</Text>

      {/* Title */}
      <Text style={styles.label}>TITLE *</Text>

      <TextInput
        style={[styles.input, !!errorMsg && styles.inputError]}
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          if (t.trim()) setErrorMsg('');
        }}
        placeholder={"Enter task title"}
        placeholderTextColor={MUTED_GREEN}
        selectionColor={NEON_GREEN}
      />
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      {/* Priority */}
      <Text style={styles.label}>PRIORITY</Text>

      <View style={styles.optionsRow}>
        <Pressable
          style={[styles.option, priority === 'high' && styles.optionActive]}
          onPress={() => setPriority('high')}
        >
          <Text
            style={[
              styles.optionText,
              priority === 'high' && styles.optionTextActive,
            ]}
          >
            HIGH
          </Text>
        </Pressable>

        <Pressable
          style={[styles.option, priority === 'medium' && styles.optionActive]}
          onPress={() => setPriority('medium')}
        >
          <Text
            style={[
              styles.optionText,
              priority === 'medium' && styles.optionTextActive,
            ]}
          >
            MEDIUM
          </Text>
        </Pressable>

        <Pressable
          style={[styles.option, priority === 'low' && styles.optionActive]}
          onPress={() => setPriority('low')}
        >
          <Text
            style={[
              styles.optionText,
              priority === 'low' && styles.optionTextActive,
            ]}
          >
            LOW
          </Text>
        </Pressable>
      </View>

      {/* Due Date */}
      <Text style={styles.label}>DUE DATE</Text>

      <TextInput
        style={styles.input}
        value={dueLabel}
        onChangeText={setDueLabel}
        placeholder="e.g. Aug 28"
        placeholderTextColor={MUTED_GREEN}
      />

      {/* Section */}
      <Text style={styles.label}>SECTION</Text>

      <View style={styles.optionsRow}>
        <Pressable
          style={[styles.option, section === 'Today' && styles.optionActive]}
          onPress={() => setSection('Today')}
        >
          <Text
            style={[
              styles.optionText,
              section === 'Today' && styles.optionTextActive,
            ]}
          >
            TODAY
          </Text>
        </Pressable>

        <Pressable
          style={[styles.option, section === 'Tomorrow' && styles.optionActive]}
          onPress={() => setSection('Tomorrow')}
        >
          <Text
            style={[
              styles.optionText,
              section === 'Tomorrow' && styles.optionTextActive,
            ]}
          >
            TOMORROW
          </Text>
        </Pressable>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </Pressable>

        <Pressable style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addText}>{isEditMode ? 'SAVE CHANGES' : 'ADD TASK'}</Text>
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

export default TaskForm;