"use client"

import React from 'react';
import { ConnectionCard } from './ConnectionCard';

interface Connection {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  lastActive?: string;
  mutualConnections?: number;
}

const mockConnections: Connection[] = [
  { id: '1', name: 'Sarah Johnson', title: 'Software Engineer at Google', lastActive: '2h ago', mutualConnections: 12 },
  { id: '2', name: 'Mike Chen', title: 'Product Manager at Meta', lastActive: '5h ago', mutualConnections: 8 },
  { id: '3', name: 'Emily Rodriguez', title: 'UX Designer at Apple', lastActive: '1d ago', mutualConnections: 15 },
  { id: '4', name: 'David Kim', title: 'Data Scientist at Amazon', lastActive: '2d ago', mutualConnections: 5 },
];

export function ConnectionsList() {
  const handleMessageClick = (id: string) => {
    console.log('Message clicked for connection:', id);
    // TODO: Navigate to messages or open chat
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Connections</h3>
        <div className="space-y-3">
          {mockConnections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              {...connection}
              onMessageClick={handleMessageClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}