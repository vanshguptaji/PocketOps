import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Note } from '../../redux/noteSlice';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';
const RED = '#FF4C4C';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete: (id: string) => void;
}

const renderDeleteAction =
  (noteId: string, onDelete: (id: string) => void) =>
  (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 90 }],
    }));

    return (
      <Reanimated.View style={[styles.deleteAction, styleAnimation]}>
        <Pressable
          style={styles.deleteActionInner}
          onPress={() => onDelete(noteId)}
          hitSlop={8}
        >
          <Text style={styles.deleteActionGlyph}>✕</Text>
          <Text style={styles.deleteActionText}>DELETE</Text>
        </Pressable>
      </Reanimated.View>
    );
  };

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onDelete }) => {
  const dateObj = new Date(note.updatedAt || note.createdAt);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeableContainer}
      friction={2}
      rightThreshold={90}
      overshootRight={false}
      renderRightActions={renderDeleteAction(note.id, onDelete)}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') {
          onDelete(note.id);
        }
      }}
    >
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title || 'UNTITLED_NOTE'}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        {note.content ? (
          <Text style={styles.contentPreview} numberOfLines={2}>
            {note.content}
          </Text>
        ) : (
          <Text style={styles.emptyPreview}>[EMPTY NOTE]</Text>
        )}
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
    padding: 16,
  },
  cardPressed: {
    borderColor: NEON_GREEN,
    backgroundColor: '#0A0A0A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  date: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
  },
  contentPreview: {
    color: '#DDDDDD',
    fontFamily: 'Courier',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyPreview: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 12,
    fontStyle: 'italic',
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
