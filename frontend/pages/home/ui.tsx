import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export const HomePage: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Home screen</Text>
      <Link href="/login">Login</Link>
    </View>
  );
};
