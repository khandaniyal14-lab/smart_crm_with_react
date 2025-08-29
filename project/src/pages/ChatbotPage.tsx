import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatbotApi } from '../services/api';
import { ChatMessage } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Bot, User, Send, Sparkles } from 'lucide-react';

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: user?.role === 'customer' 
        ? "Hello! I'm your AI support assistant. How can I help you today?" 
        : "Hello! I'm your AI assistant. I can help you with leads, complaints, and customer insights.",
      isBot: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatbotApi.sendMessage(inputMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response,
        isBot: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        isBot: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = user?.role === 'customer' 
    ? [
        "How can I submit a complaint?",
        "What's the status of my complaint?",
        "How do I contact support?",
        "What are your service hours?"
      ]
    : [
        "Show me today's lead summary",
        "What are the top complaint types?",
        "How can I improve lead scoring?",
        "Generate a customer satisfaction report"
      ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'customer' ? 'Support Chat' : 'AI Assistant'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'customer' 
              ? 'Get instant help with your questions' 
              : 'Get AI-powered insights and assistance'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">AI Online</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${message.isBot ? 'flex-row' : 'flex-row-reverse'} space-x-2`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {message.isBot ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${
                    message.isBot 
                      ? 'bg-white border border-gray-200 text-gray-900' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-200'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <LoadingSpinner size="sm" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                Suggested Questions
              </h3>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {user?.role !== 'customer' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Features</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Lead Scoring</h4>
                    <p className="text-sm text-blue-700">AI-powered lead qualification</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Complaint Analysis</h4>
                    <p className="text-sm text-green-700">Automatic categorization and routing</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">RAG Knowledge Base</h4>
                    <p className="text-sm text-purple-700">Context-aware responses</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  Clear Chat History
                </button>
                <button className="w-full p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  Download Transcript
                </button>
                {user?.role !== 'customer' && (
                  <button className="w-full p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                    Train AI Model
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;