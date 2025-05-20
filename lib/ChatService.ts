import { ChatService as GeneratedChatService } from './generated/api/services/ChatService';

export type ChatTask = {
  id: string;
  isActive?: boolean;
  exists?: boolean;
};

export type ChatMessage = {
  id: string;
  taskId: string;
  text: string;
  images?: string[];
  timestamp: string;
  sender: 'user' | 'ai';
  isQuestion?: boolean;
};

export type ChatConfiguration = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  apiEndpoint?: string;
};

export class ChatService {
  // List all chat histories (tasks)
  static async listChats(): Promise<ChatTask[]> {
    try {
      const res = await GeneratedChatService.getApiChatTasks();
      if (res.status !== 'success' || !res.tasks) {
        throw new Error(res.message || 'Failed to fetch chats');
      }
      return res.tasks.map((id: string) => ({ id }));
    } catch (error) {
      console.error('Error listing chats:', error);
      throw error;
    }
  }

  // Create a new chat history (task)
  static async createChat({ text, configuration, images, newTab }: {
    text?: string;
    configuration?: ChatConfiguration;
    images?: string[];
    newTab?: boolean;
  }): Promise<string> {
    try {
      const res = await GeneratedChatService.postApiChatTasks({ 
        requestBody: { text, configuration, images, newTab } 
      });
      if (res.status !== 'success' || !res.taskId) {
        throw new Error(res.message || 'Failed to create chat');
      }
      return res.taskId;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  // Send a message to a chat
  static async sendMessage(taskId: string, text: string, images?: string[]): Promise<string> {
    try {
      const res = await GeneratedChatService.postApiChatTasksMessages({ 
        taskId, 
        requestBody: { text, images } 
      });
      
      // Check if the response has an error status
      if (res.status === 'error') {
        throw new Error(res.message || 'Failed to send message');
      }
      
      // If we don't have a messageId but the status is success, that's fine
      if (res.status === 'success') {
        return res.messageId || '';
      }
      
      throw new Error('Unexpected response status');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Fetch chat history (messages for a task)
  static async getChatHistory(taskId: string): Promise<ChatMessage[]> {
    try {
      const res = await GeneratedChatService.getApiChatTasksMessages({ taskId });
      if (res.status !== 'success' || !res.messages) {
        throw new Error(res.message || 'Failed to fetch chat history');
      }
      // Normalize messages
      return res.messages.map((msg: {
        id?: string;
        taskId?: string;
        text?: string;
        images?: string[];
        timestamp?: string;
        sender?: 'user' | 'ai';
        isQuestion?: boolean;
      }) => ({
        id: msg.id || '',
        taskId: msg.taskId || taskId,
        text: msg.text || '',
        images: msg.images || [],
        timestamp: msg.timestamp || new Date().toISOString(),
        sender: msg.sender || 'user',
        isQuestion: msg.isQuestion || false
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  // Optionally: manage current/active chat session in-memory (for UI convenience)
  private static _activeChatId: string | null = null;

  static setActiveChat(chatId: string) {
    this._activeChatId = chatId;
  }

  static getActiveChat(): string | null {
    return this._activeChatId;
  }
} 