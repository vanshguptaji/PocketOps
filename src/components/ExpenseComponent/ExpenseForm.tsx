import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Expense,
  ExpenseCategory,
  EXPENSE_CATEGORIES,
} from '../../redux/expenseSlice';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';
const RED = '#FF4C4C';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (expense: {
    id?: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
  }) => void;
  initialExpense?: Expense;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onClose,
  onSubmit,
  initialExpense,
}) => {
  const isEditMode = !!initialExpense;

  const [title, setTitle] = useState(initialExpense?.title ?? '');
  const [amount, setAmount] = useState(
    initialExpense ? String(initialExpense.amount) : ''
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    initialExpense?.category ?? 'FOOD'
  );
  const [dateStr, setDateStr] = useState<string>(
    initialExpense?.date ?? new Date().toISOString().split('T')[0]
  );
  const [note, setNote] = useState(initialExpense?.note ?? '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});

  const validate = () => {
    const errs: { title?: string; amount?: string } = {};

    if (!title.trim()) {
      errs.title = '⚠ TITLE_REQUIRED — Please enter expense title';
    } else if (title.trim().length < 2) {
      errs.title = '⚠ TITLE_TOO_SHORT — Minimum 2 characters';
    }

    const numAmount = parseFloat(amount);
    if (!amount.trim()) {
      errs.amount = '⚠ AMOUNT_REQUIRED — Please enter amount';
    } else if (isNaN(numAmount) || numAmount <= 0) {
      errs.amount = '⚠ INVALID_AMOUNT — Must be a positive number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      ...(isEditMode ? { id: initialExpense!.id } : {}),
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: dateStr,
      note: note.trim() || undefined,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setDateStr(formatted);
    }
  };

  return (
    <ScrollView
      style={styles.formContainer}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.formTitle}>
        {isEditMode ? 'EDIT EXPENSE' : 'NEW EXPENSE'}
      </Text>

      {/* Title */}
      <Text style={styles.label}>TITLE *</Text>
      <TextInput
        style={[styles.input, errors.title && styles.inputError]}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
        }}
        placeholder="e.g. COFFEE / LUNCH"
        placeholderTextColor={MUTED_GREEN}
        selectionColor={NEON_GREEN}
      />
      {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

      {/* Amount */}
      <Text style={styles.label}>AMOUNT (₹) *</Text>
      <TextInput
        style={[styles.input, errors.amount && styles.inputError]}
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
        }}
        placeholder="0.00"
        placeholderTextColor={MUTED_GREEN}
        keyboardType="decimal-pad"
        selectionColor={NEON_GREEN}
      />
      {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

      {/* Category Picker */}
      <Text style={styles.label}>CATEGORY</Text>
      <View style={styles.categoryGrid}>
        {EXPENSE_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.key}
            style={[
              styles.categoryOption,
              category === cat.key && styles.categoryOptionActive,
            ]}
            onPress={() => setCategory(cat.key)}
          >
            <Text
              style={[
                styles.categoryOptionText,
                category === cat.key && styles.categoryOptionTextActive,
              ]}
            >
              {cat.icon} {cat.key}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Date Picker */}
      <Text style={styles.label}>DATE (YYYY-MM-DD)</Text>
      <View style={styles.dateRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={dateStr}
          onChangeText={setDateStr}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={MUTED_GREEN}
          selectionColor={NEON_GREEN}
        />
        <Pressable
          style={styles.datePickerBtn}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerBtnText}>CALENDAR</Text>
        </Pressable>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(dateStr)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Note */}
      <Text style={styles.label}>NOTE (OPTIONAL)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={note}
        onChangeText={setNote}
        placeholder="Additional comments..."
        placeholderTextColor={MUTED_GREEN}
        multiline
        numberOfLines={2}
        selectionColor={NEON_GREEN}
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addText}>
            {isEditMode ? 'SAVE CHANGES' : 'ADD EXPENSE'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    maxHeight: '85%',
  },
  scrollContent: {
    padding: 16,
  },
  formTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
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
    backgroundColor: '#050505',
  },
  inputError: {
    borderColor: RED,
  },
  errorText: {
    color: RED,
    fontFamily: 'Courier',
    fontSize: 11,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#000000',
  },
  categoryOptionActive: {
    backgroundColor: NEON_GREEN,
    borderColor: NEON_GREEN,
  },
  categoryOptionText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryOptionTextActive: {
    color: '#000000',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: MUTED_GREEN,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  datePickerBtnText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },
  textArea: {
    minHeight: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 8,
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
