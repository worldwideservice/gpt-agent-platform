'use client'

import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import type { ChatMessage } from '@/types'

const ChatPage = () => {
  const [selectedAgent, setSelectedAgent] = useState('1')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Я AI-консультант. Чем могу помочь?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Имитация ответа AI
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Спасибо за ваше сообщение! Это тестовый ответ AI-агента. В реальной системе здесь будет полноценный ответ на основе настроенных инструкций и базы знаний.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Тестовый чат</h1>
        <p className="text-gray-600 mt-1">
          Протестируйте работу AI-агента в реальном времени
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardBody>
              <h3 className="font-semibold text-gray-900 mb-4">Настройки чата</h3>
              <Select
                label="Выберите агента"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                options={[
                  { value: '1', label: 'Консультант по продажам' },
                  { value: '2', label: 'Техническая поддержка' },
                  { value: '3', label: 'Квалификация лидов' },
                ]}
              />
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setMessages([{
                  id: '1',
                  role: 'assistant',
                  content: 'Здравствуйте! Я AI-консультант. Чем могу помочь?',
                  timestamp: new Date(),
                }])}
              >
                Очистить чат
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-280px)] flex flex-col">
            <CardBody className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'assistant'
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <Bot className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-2xl ${
                        message.role === 'user' ? 'flex justify-end' : ''
                      }`}
                    >
                      <div
                        className={`p-4 rounded-lg ${
                          message.role === 'assistant'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === 'assistant' ? 'text-gray-500' : 'text-primary-100'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-100 text-primary-600">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-end space-x-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Введите сообщение..."
                  rows={3}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2 h-[76px]"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

