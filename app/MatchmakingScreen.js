import { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as api from './api';

export default function MatchmakingScreen() {
  const [interest, setInterest] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMatch = async () => {
    setLoading(true);
    try {
      const res = await api.matchUsers(interest);
      setUsers(res);
      setMessage('');
    } catch (err) {
      setMessage('Error finding matches');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Matches</Text>
      <TextInput style={styles.input} placeholder="Enter interest..." value={interest} onChangeText={setInterest} />
      <Button title="Find Matches" onPress={handleMatch} />
      {loading ? <Text>Loading...</Text> : (
        <FlatList
          data={users}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.username}>{item.username}</Text>
              <Text>{item.email}</Text>
            </View>
          )}
        />
      )}
      <Text>{message}</Text>
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
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
