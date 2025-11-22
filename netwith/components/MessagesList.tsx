"use client"

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatar?: string;
}

const mockMessages: Message[] = [
  { id: '1', name: 'Sarah Johnson', lastMessage: 'Thanks for connecting! Would love to chat about...', timestamp: '10m ago', unread: true },
  { id: '2', name: 'Mike Chen', lastMessage: 'That sounds great! When would be a good time?', timestamp: '1h ago', unread: true },
  { id: '3', name: 'Emily Rodriguez', lastMessage: 'I saw your latest project, really impressive work!', timestamp: '3h ago', unread: false },
  { id: '4', name: 'David Kim', lastMessage: 'Let me know if you need any help with that', timestamp: '1d ago', unread: false },
  { id: '5', name: 'Alex Thompson', lastMessage: 'Sure, I\'ll send you the details tomorrow', timestamp: '2d ago', unread: false },
];

export function MessagesList() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages</h3>
        <div className="space-y-2">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
                message.unread ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {message.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                {/* Message Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold truncate ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.name}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{message.timestamp}</span>
                  </div>
                  <p className={`text-sm truncate ${message.unread ? 'text-gray-700 font-medium' : 'text-gray-600'}`}>
                    {message.lastMessage}
                  </p>
                  {message.unread && (
                    <div className="mt-2">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {mockMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start connecting with people to begin conversations</p>
          </div>
        )}
      </div>
    </div>
  );
}