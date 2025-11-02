import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { LogOut } from 'lucide-react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userModel } from '@/entities/user';

export const SettingsPage: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center style={{ flex: 1 }}>
        <VStack style={{ maxWidth: 400, width: '100%' }} space="xs">
          <Text>Setting</Text>
          <Button action="negative" onPress={() => userModel.loggedOut()}>
            <ButtonIcon as={LogOut} />
            <ButtonText>Log out</ButtonText>
          </Button>
        </VStack>
      </Center>
    </SafeAreaView>
  );
};
