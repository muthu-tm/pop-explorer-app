'use client';
import React from 'react';
import { Message } from '@/types';
import { formatHash, truncateText } from '@/utils/formatters';

interface MessagesTableProps {
  messages: Message[];
}

const MessagesTable: React.FC<MessagesTableProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No messages found. Use the search filters above to fetch data.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Block
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thread
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Leaf
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Content
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hash
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Micro Root
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {messages.map((msg, index) => (
            <tr key={`${msg.block_number}-${msg.thread_id}-${msg.leaf_index}-${index}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {msg.block_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {msg.thread_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {msg.leaf_index}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <span title={msg.original}>{truncateText(msg.original, 50)}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                <span title={msg.hash}>{formatHash(msg.hash)}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                <span title={msg.microRoot}>{formatHash(msg.microRoot)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessagesTable;