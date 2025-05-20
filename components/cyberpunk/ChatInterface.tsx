'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, ThumbsUp, ThumbsDown, HelpCircle, Plus, RefreshCw } from 'lucide-react'
import { ChatService, ChatMessage, ChatTask } from '@/lib/ChatService'

interface QuestionMessage {
  question: string;
  suggest: string[];
}

const ChatInterface: React.FC = () => {
  const [chats, setChats] = useState<ChatTask[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loadingChats, setLoadingChats] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [creating, setCreating] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set())
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Load chat histories on mount
  useEffect(() => {
    fetchChats()
  }, [])

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId, true)
      ChatService.setActiveChat(activeChatId)
    } else {
      setMessages([])
    }
  }, [activeChatId])

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Poll for new messages every 2 seconds
  useEffect(() => {
    if (!activeChatId) return;

    const interval = setInterval(() => {
      fetchMessages(activeChatId, false);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeChatId]);

  async function fetchChats() {
    setLoadingChats(true)
    try {
      const chatList = await ChatService.listChats()
      setChats(chatList)
      // Auto-select the first chat if none selected
      if (!activeChatId && chatList.length > 0) {
        setActiveChatId(chatList[0].id)
      }
    } catch {
      // TODO: handle error
    } finally {
      setLoadingChats(false)
    }
  }

  async function fetchMessages(chatId: string, showLoading: boolean = false) {
    if (showLoading) {
      setLoadingMessages(true)
    }
    try {
      const msgs = await ChatService.getChatHistory(chatId)
      setMessages(msgs)
    } catch {
      setMessages([])
      // TODO: handle error
    } finally {
      if (showLoading) {
        setLoadingMessages(false)
      }
    }
  }

  async function handleSendMessage(text: string) {
    if (!text.trim()) return
    
    setSending(true)
    try {
      // If there's no active chat, create a new one with this message
      if (!activeChatId) {
        const newChatId = await ChatService.createChat({ text })
        await fetchChats()
        setActiveChatId(newChatId)
      } else {
        await ChatService.sendMessage(activeChatId, text)
        // Don't wait for fetchMessages to complete
        fetchMessages(activeChatId, false)
      }
      setInputValue('')
    } catch (error) {
      console.error('Error sending message:', error)
      // TODO: Show error to user
      // For now, just log it
    } finally {
      setSending(false)
    }
  }

  async function handleQuickResponse(response: string) {
    await handleSendMessage(response)
  }

  async function handleCreateChat() {
    setCreating(true)
    try {
      // Just clear the current chat without creating a new one
      setActiveChatId(null)
      setMessages([])
      setSelectedSuggestions(new Set())
    } catch {
      // TODO: handle error
    } finally {
      setCreating(false)
    }
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function parseQuestionMessage(text: string): QuestionMessage | null {
    try {
      const parsed = JSON.parse(text) as QuestionMessage;
      if (typeof parsed.question === 'string' && Array.isArray(parsed.suggest)) {
        return parsed;
      }
    } catch {
      // Not a valid question message
    }
    return null;
  }

  function handleSuggestionClick(messageId: string, suggestion: string) {
    if (selectedSuggestions.has(messageId)) return;
    
    setSelectedSuggestions(prev => new Set([...prev, messageId]));
    handleSendMessage(suggestion);
  }

  function renderMessage(message: ChatMessage) {
    if (message.isQuestion) {
      const questionData = parseQuestionMessage(message.text);
      if (questionData) {
        return (
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary/20 border border-secondary/30 text-foreground">
            <div className="text-sm font-medium mb-2">{questionData.question}</div>
            <div className="flex flex-wrap gap-2">
              {questionData.suggest.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(message.id, suggestion)}
                  disabled={selectedSuggestions.has(message.id)}
                  className={`px-3 py-1.5 rounded text-sm transition-all ${
                    selectedSuggestions.has(message.id)
                      ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      : 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {formatTime(message.timestamp)}
            </div>
          </div>
        );
      }
    }

    return (
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.sender === 'user' 
            ? 'bg-primary/20 border border-primary/30 text-primary' 
            : 'bg-secondary/20 border border-secondary/30 text-foreground'
        }`}
      >
        <div className="text-sm">{message.text}</div>
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {formatTime(message.timestamp)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg shadow-md overflow-hidden">
      {/* Chat Header with chat selector and new chat button */}
      <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-primary">
            <span className="text-secondary">AI</span>::ASSISTANT
          </span>
          <button
            onClick={fetchChats}
            className="ml-2 p-1 rounded hover:bg-muted/50"
            title="Refresh Chats"
            disabled={loadingChats}
          >
            <RefreshCw className={`h-4 w-4 ${loadingChats ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 text-sm bg-background"
            value={activeChatId || ''}
            onChange={e => setActiveChatId(e.target.value)}
            disabled={loadingChats || chats.length === 0}
          >
            {chats.map(chat => (
              <option key={chat.id} value={chat.id}>
                Chat {chat.id.slice(0, 6)}
              </option>
            ))}
          </select>
          <button
            onClick={handleCreateChat}
            className="ml-2 p-1 rounded hover:bg-green-100 border border-green-500 text-green-600"
            title="New Chat"
            disabled={creating}
          >
            <Plus className={`h-4 w-4 ${creating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div ref={chatContainerRef} id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingMessages ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">No messages yet.</div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {renderMessage(message)}
            </div>
          ))
        )}
      </div>
      
      {/* Quick Response Buttons */}
      <div className="px-4 py-2 border-t border-border flex justify-center space-x-3">
        <button 
          onClick={() => handleQuickResponse('Yes')}
          className="px-4 py-1.5 bg-green-500/10 border border-green-500/30 text-green-500 rounded hover:bg-green-500/20 transition-all"
        >
          <ThumbsUp className="h-4 w-4 inline mr-1" /> Yes
        </button>
        <button 
          onClick={() => handleQuickResponse('No')}
          className="px-4 py-1.5 bg-destructive/10 border border-destructive/30 text-destructive rounded hover:bg-destructive/20 transition-all"
        >
          <ThumbsDown className="h-4 w-4 inline mr-1" /> No
        </button>
        <button 
          onClick={() => handleQuickResponse('Maybe, tell me more')}
          className="px-4 py-1.5 bg-secondary/10 border border-secondary/30 text-secondary rounded hover:bg-secondary/20 transition-all"
        >
          <HelpCircle className="h-4 w-4 inline mr-1" /> Maybe
        </button>
      </div>
      
      {/* Chat Input */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center">
          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(inputValue)
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
            rows={1}
            disabled={sending}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || sending}
            className="ml-2 p-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary/30 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface