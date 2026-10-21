import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/store';
import { removeNote, Note } from '../redux/noteSlice';
import { NoteCard } from '../components/NotesComponent/NoteCard';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';

type SortOption = 'newest' | 'oldest' | 'alphabetical';

const NoteListScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const notes = useSelector((state: RootState) => state.note.notes);

  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

    // Filter by search query
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'newest') {
        return (
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime()
        );
      } else if (sortOption === 'oldest') {
        return (
          new Date(a.updatedAt || a.createdAt).getTime() -
          new Date(b.updatedAt || b.createdAt).getTime()
        );
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [notes, searchText, sortOption]);

  const handleOpenNote = (noteId?: string) => {
    navigation.navigate('NotesDetail', { noteId });
  };

  const handleDeleteNote = (id: string) => {
    dispatch(removeNote(id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NOTES.LOG</Text>
          <Text style={styles.headerCount}>{notes.length} ENTRIES</Text>
        </View>

        {/* Search Input */}
        <View
          style={[
            styles.searchWrapper,
            isSearchFocused && styles.searchWrapperFocused,
          ]}
        >
          <Text style={styles.searchPrompt}>{'>'}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="search notes..."
            placeholderTextColor={MUTED_GREEN}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={NEON_GREEN}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText('')} hitSlop={8}>
              <Text style={styles.searchClear}>×</Text>
            </Pressable>
          )}
        </View>

        {/* Sort Options */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>SORT:</Text>
          {(['newest', 'oldest', 'alphabetical'] as SortOption[]).map((option) => (
            <Pressable
              key={option}
              style={[
                styles.sortChip,
                sortOption === option && styles.sortChipActive,
              ]}
              onPress={() => setSortOption(option)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortOption === option && styles.sortChipTextActive,
                ]}
              >
                {option.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Note List */}
        <FlatList
          data={filteredAndSortedNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => handleOpenNote(item.id)}
              onDelete={handleDeleteNote}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {searchText ? 'NO MATCHING NOTES' : 'NO NOTES YET'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchText
                  ? 'Try a different search query'
                  : 'Tap + to create your first note entry'}
              </Text>
            </View>
          }
        />

        {/* FAB */}
        <Pressable style={styles.fab} onPress={() => handleOpenNote()}>
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>
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
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sortLabel: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sortChip: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#000000',
  },
  sortChipActive: {
    backgroundColor: NEON_GREEN,
    borderColor: NEON_GREEN,
  },
  sortChipText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sortChipTextActive: {
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
});

export default NoteListScreen;
