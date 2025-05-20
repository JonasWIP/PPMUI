'use client'

import React, { useState, useEffect } from 'react'
import { Send, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react'

type Message = {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
}

type ChatInterfaceProps = {
  projectName?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatInterface: React.FC<ChatInterfaceProps> = ({ projectName }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading] = useState(false) // Always false since we're not making API calls

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickResponse = (response: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: response,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="bg-muted px-4 py-3 border-b border-border">
        <h2 className="text-lg font-medium text-primary">
          <span className="text-secondary">AI</span>::ASSISTANT
        </h2>
      </div>
      
      {/* Chat Messages */}
      <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-primary/20 border border-primary/30 text-primary' 
                  : 'bg-secondary/20 border border-secondary/30 text-foreground'
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary/20 border border-secondary/30 rounded-lg px-4 py-2 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
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
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
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