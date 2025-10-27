import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Splash() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text>Loading...</Text>
      </View>
    </SafeAreaView>
  );
}
