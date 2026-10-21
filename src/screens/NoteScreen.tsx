import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../redux/store';
import { addNote, updateNote, removeNote } from '../redux/noteSlice';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';
const RED = '#FF4C4C';

const NoteScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const noteId = route.params?.noteId;
  const existingNote = useSelector((state: RootState) =>
    state.note.notes.find((n) => n.id === noteId)
  );

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
    }
  }, [existingNote]);

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMessage('⚠ TITLE_REQUIRED — Please enter a note title');
      return;
    }

    if (noteId && existingNote) {
      dispatch(updateNote({ id: noteId, title: title.trim(), content }));
    } else {
      dispatch(addNote({ title: title.trim(), content }));
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (noteId) {
      dispatch(removeNote(noteId));
    }
    navigation.goBack();
  };

  const formattedTimestamp = existingNote
    ? `UPDATED: ${new Date(existingNote.updatedAt || existingNote.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
    : `CREATED: NEW_ENTRY`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.headerBtnText}>{'< BACK'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {noteId ? 'EDIT_NOTE' : 'NEW_NOTE'}
          </Text>
          <View style={styles.headerRightActions}>
            {noteId && (
              <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>DEL</Text>
              </Pressable>
            )}
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>SAVE</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.timestampRow}>
          <Text style={styles.timestampText}>{formattedTimestamp}</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={[styles.input, styles.titleInput]}
            placeholder="NOTE_TITLE..."
            placeholderTextColor={MUTED_GREEN}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (text.trim()) setErrorMessage('');
            }}
            selectionColor={NEON_GREEN}
            autoFocus={!noteId}
          />

          <Text style={styles.label}>CONTENT</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Write details here..."
            placeholderTextColor={MUTED_GREEN}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            selectionColor={NEON_GREEN}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  headerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerBtnText: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 13,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: NEON_GREEN,
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deleteBtnText: {
    color: RED,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: NEON_GREEN,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  saveBtnText: {
    color: '#000000',
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
  },
  timestampRow: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#050505',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  timestampText: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
  },
  errorContainer: {
    backgroundColor: '#1A0000',
    borderWidth: 1,
    borderColor: RED,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 10,
    borderRadius: 4,
  },
  errorText: {
    color: RED,
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    padding: 12,
    color: '#DDDDDD',
    fontFamily: 'Courier',
    backgroundColor: '#050505',
  },
  titleInput: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 14,
    minHeight: 250,
    lineHeight: 20,
  },
});

export default NoteScreen;