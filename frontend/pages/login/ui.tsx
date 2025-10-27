import { LoginForm } from '@/features/user/login';
import { View } from 'react-native';

export const LoginPage: React.FC = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LoginForm />
    </View>
  );
};
