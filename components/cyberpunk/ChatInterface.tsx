'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Plus, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
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
  const [previousMessageCount, setPreviousMessageCount] = useState(0)
  const [isUserAtBottom, setIsUserAtBottom] = useState(true)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const [inputAreaHeight, setInputAreaHeight] = useState(120) // Default height for input area
  const [isDragging, setIsDragging] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  // Load chat histories on mount
  useEffect(() => {
    fetchChats()
  }, [])

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      setIsInitialLoad(true)
      fetchMessages(activeChatId, true)
      ChatService.setActiveChat(activeChatId)
    } else {
      setMessages([])
    }
  }, [activeChatId])

  // Track scroll position to determine if user is at bottom
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const threshold = 15 // More permissive threshold - 15px from bottom
      const isAtBottom = scrollHeight - scrollTop - clientHeight <= threshold
      setIsUserAtBottom(isAtBottom)
    }
  }, [])

  // Intelligent auto-scroll logic
  useEffect(() => {
    const currentMessageCount = messages.length
    const hasNewMessages = currentMessageCount > previousMessageCount
    
    // Auto-scroll if:
    // 1. It's an initial load of a chat (always scroll to bottom), OR
    // 2. There are new messages AND user is at bottom, OR
    // 3. shouldAutoScroll flag is set (for user-sent messages)
    if (chatContainerRef.current && (isInitialLoad || shouldAutoScroll || (hasNewMessages && isUserAtBottom))) {
      // Use setTimeout to ensure DOM is updated before scrolling
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      }, 0)
      
      setShouldAutoScroll(false) // Reset the flag
      setIsInitialLoad(false) // Reset initial load flag
    }
    
    // Update previous message count
    setPreviousMessageCount(currentMessageCount)
  }, [messages, isUserAtBottom, shouldAutoScroll, previousMessageCount, isInitialLoad])

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
      
      // If this is an initial load (when switching chats or loading for first time),
      // ensure we scroll to bottom after messages are set
      if (showLoading && msgs.length > 0) {
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
          }
        }, 100) // Slightly longer delay to ensure DOM updates are complete
      }
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
    // Always scroll when user sends a message
    setShouldAutoScroll(true)
    
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

  // Update textarea height to fill available space
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Calculate height to fill most of the available input area height
      // Account for padding (py-3 = 24px) and some margin
      const newHeight = Math.max(inputAreaHeight - 32, 40) // 32px for padding and margins
      textarea.style.height = `${newHeight}px`
    }
  }, [inputAreaHeight])

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    adjustTextareaHeight()
  }, [adjustTextareaHeight])

  // Adjust height when input value changes or input area height changes
  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue, inputAreaHeight, adjustTextareaHeight])

  // Handle drag start for resizing
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    const startY = e.clientY
    const startHeight = inputAreaHeight
    setIsDragging(true)
    e.preventDefault()
    
    // Add global mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY // Inverted because we want drag up to increase height
      const newHeight = Math.min(Math.max(startHeight + deltaY, 80), 400) // Min 80px, max 400px
      setInputAreaHeight(newHeight)
    }
    
    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [inputAreaHeight])

  // Adjust textarea height when component mounts
  useEffect(() => {
    adjustTextareaHeight()
  }, [adjustTextareaHeight])

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
        <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              // Customize styling for different markdown elements
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted p-2 rounded overflow-x-auto text-xs">{children}</pre>
              ),
              h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ children, href }) => (
                <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-muted pl-4 italic">{children}</blockquote>
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
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
      <div
        ref={chatContainerRef}
        id="chat-messages"
        className="overflow-y-auto p-4 space-y-4"
        style={{ height: `calc(100% - ${inputAreaHeight}px)` }}
        onScroll={handleScroll}
      >
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
      
      {/* Resizable Divider */}
      <div
        ref={dividerRef}
        className={`h-1 bg-border hover:bg-primary/30 cursor-ns-resize transition-colors relative group ${
          isDragging ? 'bg-primary/50' : ''
        }`}
        onMouseDown={handleDragStart}
      >
        <div className="absolute inset-x-0 -top-1 -bottom-1 group-hover:bg-primary/10 transition-colors" />
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-muted-foreground/50 group-hover:bg-primary/70 transition-colors rounded-full" />
      </div>
      
      {/* Chat Input */}
      <div
        className="px-4 py-3 border-t border-border flex flex-col"
        style={{ height: `${inputAreaHeight}px`, minHeight: '80px' }}
      >
        <div className="flex items-stretch h-full gap-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(inputValue)
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
            style={{
              minHeight: '40px',
              height: `${Math.max(inputAreaHeight - 32, 40)}px` // Fill most of the available height
            }}
            disabled={sending}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || sending}
            className="p-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary/30 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface