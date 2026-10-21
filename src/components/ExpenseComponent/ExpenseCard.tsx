import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Expense, EXPENSE_CATEGORIES } from '../../redux/expenseSlice';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';
const RED = '#FF4C4C';

interface ExpenseCardProps {
  expense: Expense;
  onPress: () => void;
  onDelete: (id: string) => void;
}

const renderDeleteAction =
  (expenseId: string, onDelete: (id: string) => void) =>
  (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 90 }],
    }));

    return (
      <Reanimated.View style={[styles.deleteAction, styleAnimation]}>
        <Pressable
          style={styles.deleteActionInner}
          onPress={() => onDelete(expenseId)}
          hitSlop={8}
        >
          <Text style={styles.deleteActionGlyph}>✕</Text>
          <Text style={styles.deleteActionText}>DELETE</Text>
        </Pressable>
      </Reanimated.View>
    );
  };

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onPress,
  onDelete,
}) => {
  const categoryObj = EXPENSE_CATEGORIES.find((c) => c.key === expense.category);
  const icon = categoryObj ? categoryObj.icon : '⊘';

  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeableContainer}
      friction={2}
      rightThreshold={90}
      overshootRight={false}
      renderRightActions={renderDeleteAction(expense.id, onDelete)}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') {
          onDelete(expense.id);
        }
      }}
    >
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        <View style={styles.leftCol}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{icon}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.title} numberOfLines={1}>
              {expense.title}
            </Text>
            <View style={styles.subRow}>
              <Text style={styles.categoryText}>{expense.category}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.dateText}>{expense.date}</Text>
            </View>
            {expense.note ? (
              <Text style={styles.noteText} numberOfLines={1}>
                {expense.note}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.amountText}>₹{expense.amount.toFixed(2)}</Text>
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: 12,
    borderRadius: 4,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPressed: {
    borderColor: NEON_GREEN,
    backgroundColor: '#0A0A0A',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: MUTED_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#050505',
  },
  categoryIcon: {
    color: NEON_GREEN,
    fontSize: 18,
    fontFamily: 'Courier',
  },
  details: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dot: {
    color: MUTED_GREEN,
    fontSize: 10,
  },
  dateText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
  },
  noteText: {
    color: '#888888',
    fontFamily: 'Courier',
    fontSize: 11,
    marginTop: 2,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  amountText: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteActionText: {
    color: RED,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
