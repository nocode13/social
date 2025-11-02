export type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  email_verified_at: any;
  created_at: string;
  updated_at: string;
};

export type Chat = {
  id: number;
  type: string;
  avatar: any;
  participants: ChatParticipant[];
  last_message_at: any;
  created_at: string;
  updated_at: string;
};

export type ChatParticipant = User & {
  role: string;
  last_read_at: any;
  muted: boolean;
};

export type ShortChat = Omit<Chat, 'participants'>;
