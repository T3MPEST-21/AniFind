import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as api from './api';

export default function AnimeScreen() {
  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      const res = await api.listAnime();
      setAnimes(res);
      setMessage('');
    } catch (err) {
      setMessage('Error loading anime');
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.searchAnime(search);
      setAnimes(res);
      setMessage('');
    } catch (err) {
      setMessage('Error searching anime');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container} accessible accessibilityLabel="Anime List Screen" accessibilityHint="Browse and search for anime titles.">
      <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Anime List">Anime List</Text>
      <TextInput
        style={styles.input}
        placeholder="Search anime..."
        value={search}
        onChangeText={setSearch}
        accessible
        accessibilityLabel="Search anime"
        accessibilityHint="Enter anime title to search"
      />
      <Button
        title="Search"
        onPress={handleSearch}
        accessibilityLabel="Search Button"
        accessibilityHint="Tap to search for anime by title"
      />
      {loading ? <Text accessibilityLiveRegion="polite">Loading...</Text> : (
        <FlatList
          data={animes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item} accessible accessibilityLabel={`Anime: ${item.title}`} accessibilityHint={`Genre: ${item.genre}. Description: ${item.description}`}> 
              <Text style={styles.animeTitle} accessibilityLabel={`Title: ${item.title}`}>{item.title}</Text>
              <Text accessibilityLabel={`Description: ${item.description}`}>{item.description}</Text>
              <Text accessibilityLabel={`Genre: ${item.genre}`}>{item.genre}</Text>
            </View>
          )}
        />
      )}
      <Text accessibilityLiveRegion="polite">{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  animeTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
