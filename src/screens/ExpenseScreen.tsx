import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  Expense,
  ExpenseCategory,
  EXPENSE_CATEGORIES,
  addExpense,
  updateExpense,
  removeExpense,
} from '../redux/expenseSlice';
import { ExpenseCard } from '../components/ExpenseComponent/ExpenseCard';
import { ExpenseForm } from '../components/ExpenseComponent/ExpenseForm';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';

const ExpenseScreen = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state: RootState) => state.expense.expenses);

  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'ALL'>('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  // Compute daily & monthly totals
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const currentMonthStr = useMemo(() => todayStr.substring(0, 7), [todayStr]); // YYYY-MM

  const totals = useMemo(() => {
    let todayTotal = 0;
    let monthTotal = 0;

    expenses.forEach((item) => {
      if (item.date === todayStr) {
        todayTotal += item.amount;
      }
      if (item.date.startsWith(currentMonthStr)) {
        monthTotal += item.amount;
      }
    });

    return { todayTotal, monthTotal };
  }, [expenses, todayStr, currentMonthStr]);

  // Filter & sort expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    if (selectedCategory !== 'ALL') {
      result = result.filter((e) => e.category === selectedCategory);
    }
    // Sort by date descending
    result.sort((a, b) => b.date.localeCompare(a.date));
    return result;
  }, [expenses, selectedCategory]);

  const handleOpenNew = () => {
    setEditingExpense(undefined);
    setModalVisible(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setModalVisible(true);
  };

  const handleFormSubmit = (data: {
    id?: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
  }) => {
    if (data.id) {
      dispatch(
        updateExpense({
          id: data.id,
          title: data.title,
          amount: data.amount,
          category: data.category,
          date: data.date,
          note: data.note,
        })
      );
    } else {
      dispatch(
        addExpense({
          title: data.title,
          amount: data.amount,
          category: data.category,
          date: data.date,
          note: data.note,
        })
      );
    }
    setModalVisible(false);
    setEditingExpense(undefined);
  };

  const handleDelete = (id: string) => {
    dispatch(removeExpense(id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>EXPENSES.LOG</Text>
          <Text style={styles.headerCount}>{expenses.length} RECORDS</Text>
        </View>

        {/* Totals Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>SPENT TODAY</Text>
            <Text style={styles.summaryValue}>₹{totals.todayTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>THIS MONTH</Text>
            <Text style={styles.summaryValue}>₹{totals.monthTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Category Filter Chips */}
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            <Pressable
              style={[
                styles.chip,
                selectedCategory === 'ALL' && styles.chipActive,
              ]}
              onPress={() => setSelectedCategory('ALL')}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === 'ALL' && styles.chipTextActive,
                ]}
              >
                ALL
              </Text>
            </Pressable>
            {EXPENSE_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.key}
                style={[
                  styles.chip,
                  selectedCategory === cat.key && styles.chipActive,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategory === cat.key && styles.chipTextActive,
                  ]}
                >
                  {cat.icon} {cat.key}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Expense List */}
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseCard
              expense={item}
              onPress={() => handleOpenEdit(item)}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>NO EXPENSES LOGGED</Text>
              <Text style={styles.emptySubtitle}>
                {selectedCategory !== 'ALL'
                  ? `No records found under category ${selectedCategory}`
                  : 'Tap + to record your first expense entry'}
              </Text>
            </View>
          }
        />

        {/* FAB */}
        <Pressable style={styles.fab} onPress={handleOpenNew}>
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>

        {/* Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ExpenseForm
              onClose={() => setModalVisible(false)}
              onSubmit={handleFormSubmit}
              initialExpense={editingExpense}
            />
          </View>
        </Modal>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  headerCount: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 12,
  },
  summaryLabel: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryValue: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterWrapper: {
    marginBottom: 16,
  },
  filterContainer: {
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#000000',
  },
  chipActive: {
    backgroundColor: NEON_GREEN,
    borderColor: NEON_GREEN,
  },
  chipText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chipTextActive: {
    color: '#000000',
  },
  listContent: {
    paddingBottom: 90,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#666666',
    fontFamily: 'Courier',
    fontSize: 12,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
});

export default ExpenseScreen;