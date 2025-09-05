import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as api from './api';

export default function ProfileScreen({ username }) {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        setMessage('Not authenticated');
        setLoading(false);
        return;
      }
      try {
        const res = await api.getProfile(username, token);
        setProfile(res);
        setMessage('');
      } catch (err) {
        setMessage('Error fetching profile');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [username]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {loading ? <Text>Loading...</Text> : profile ? (
        <View>
          <Text>Username: {profile.username}</Text>
          <Text>Email: {profile.email}</Text>
        </View>
      ) : <Text>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});
