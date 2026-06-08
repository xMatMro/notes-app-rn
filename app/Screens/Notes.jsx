import { useState, useEffect } from "react";
import Note from "../components/Note";
import * as SecureStore from 'expo-secure-store';
import { View, FlatList, Alert, StyleSheet, TextInput, Text } from "react-native";
import MyButton from "../components/MyButton";

const Notes = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([])

  const loadNotes = async () => {
    const categoryTemp = await SecureStore.getItemAsync('category');
    setCategories(categoryTemp ? JSON.parse(categoryTemp) : []);
    const temp = await SecureStore.getItemAsync("keys");
    const keys = temp ? JSON.parse(temp).filter(e => e !== "") : [];
    const loaded = await Promise.all(keys.map(async title => {
      const raw = await SecureStore.getItemAsync(title);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        title,
        notes: parsed.notes || '',
        date: parsed.date || '',
        category: parsed.category != null ? parsed.category : null,
      };
    }));
    setNotes(loaded.filter(Boolean));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const deleteNote = async (title) => {
    const temp = await SecureStore.getItemAsync("keys")
    if (temp) {
      let deleteTitles = JSON.parse(temp)
      deleteTitles = deleteTitles.filter(e => e != title)
      await SecureStore.setItemAsync("keys", JSON.stringify(deleteTitles))
      await SecureStore.deleteItemAsync(title)
      setNotes(prev => prev.filter(item => item.title !== title));
    }
  }

  const DeleteAlert = (title) => {
    Alert.alert('Ostrzeżenie', 'Czy chcesz usunąć tę notatkę?', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Usuń', style: 'destructive', onPress: () => deleteNote(title) }
    ]);
  }

  const deleteAll = async () => {
    const temp = await SecureStore.getItemAsync("keys")
    if (temp) {
      const deleteTitles = JSON.parse(temp)
      for (const title of deleteTitles) {
        await SecureStore.deleteItemAsync(title)
      }
      await SecureStore.setItemAsync('keys', JSON.stringify([]))
      setNotes([])
    }
  }

  const filteredNotes = notes.filter(item => {
    const lowerQuery = searchQuery.toLowerCase();
    const categoryIndex = item.category != null ? Number(item.category) : null;
    const categoryLabel = Number.isFinite(categoryIndex) && Array.isArray(categories) && categories[categoryIndex]
      ? categories[categoryIndex].toString().toLowerCase()
      : '';

    return (
      item.title.toLowerCase().includes(lowerQuery) ||
      item.notes.toLowerCase().includes(lowerQuery) ||
      item.date.toLowerCase().includes(lowerQuery) ||
      categoryLabel.includes(lowerQuery)
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Wszystkie notatki</Text>
      <TextInput
        style={styles.search}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder='Szukaj po tytule, treści, dacie lub kategorii'
        placeholderTextColor='#888'
      />
      <View style={styles.infoRow}>
        <Text style={styles.count}>{filteredNotes.length} {filteredNotes.length === 1 ? 'notatka' : 'notatek'}</Text>
        <MyButton background={'#d0342c'} text={'Usuń wszystkie'} textColor={'white'} fun={deleteAll} />
      </View>
      <FlatList
        data={filteredNotes}
        numColumns={2}
        renderItem={({ item }) => <Note title={item.title} onDelete={() => DeleteAlert(item.title)} navigation={navigation} />}
        keyExtractor={item => item.title}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Brak notatek do wyświetlenia.</Text>}
        contentContainerStyle={filteredNotes.length === 0 ? styles.emptyContainer : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f8ff',
    padding: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22304d',
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: '#aac8ff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    color: '#111',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  count: {
    color: '#3d5c8a',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  empty: {
    color: '#5f6d7d',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  }
})

export default Notes