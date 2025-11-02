import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { useGate, useUnit } from 'effector-react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as model from './model';
import { ChatFilters } from '@/features/chat/filter';
import { Link } from 'expo-router';

export const ChatsPage: React.FC = () => {
  useGate(model.Gate);
  const [chats] = useUnit([model.$chats]);

  return (
    <SafeAreaView>
      <VStack space="sm">
        <Heading size="2xl">Chats</Heading>
        <ChatFilters />
        <FlatList
          style={{ margin: 8 }}
          data={chats}
          renderItem={(chat) => (
            <Link href={{ pathname: '/[id]', params: { id: chat.item.id } }}>
              <HStack
                space="sm"
                style={{
                  backgroundColor: '#FFF',
                  padding: 4,
                  borderRadius: 4,
                  width: '100%',
                }}
              >
                <Heading>{chat.item.id}</Heading>
              </HStack>
            </Link>
          )}
        />
      </VStack>
    </SafeAreaView>
  );
};
