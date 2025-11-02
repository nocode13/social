import { Input, InputField } from '@/components/ui/input';

export const ChatFilters: React.FC = () => {
  return (
    <Input variant="outline" size="md">
      <InputField placeholder="Enter Text here..." />
    </Input>
  );
};
