'use client';
import React from 'react';
import { Message } from '@/types';
import { LoadingButton, EmptyState } from '@/components/ui';
import MessagesTable from '@/components/tables/MessagesTable';

interface MessagesTabProps {
  messages: Message[];
  onLoadMessages: () => void;
  isLoading: boolean;
}

const MessagesTab: React.FC<MessagesTabProps> = ({ messages, onLoadMessages, isLoading }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Messages</h3>
        <LoadingButton onClick={onLoadMessages} isLoading={isLoading}>
          Load Messages
        </LoadingButton>
      </div>

      {messages.length === 0 ? (
        <EmptyState message="No messages found. Use the search filters above or click 'Load Messages' to fetch data." />
      ) : (
        <MessagesTable messages={messages} />
      )}
    </div>
  );
};

export default MessagesTab;
