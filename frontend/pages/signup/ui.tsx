import { SignupForm } from '@/features/user/signup';
import { View } from 'react-native';

export const SignupPage: React.FC = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SignupForm />
    </View>
  );
};
