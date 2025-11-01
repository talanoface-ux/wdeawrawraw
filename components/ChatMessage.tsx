import React from 'react';
import { Message, Role } from '../types';
import { UserCircleIcon, SparklesIcon, WalletIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`my-4 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex w-full items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-rose-400" />
          </div>
        )}
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg shadow-md overflow-hidden flex flex-col ${
            isUser
              ? 'bg-blue-600 text-white rounded-2xl rounded-br-lg'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-bl-lg'
          }`}
        >
          {message.attachment && (
              <img 
                  src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} 
                  alt="پیوست" 
                  className="max-h-64 w-full object-cover"
              />
          )}
          {message.content && (
              <p className={`px-4 py-3 whitespace-pre-wrap break-words ${!isUser ? 'font-playpen font-medium' : ''}`}>
                  {message.content}
              </p>
          )}
        </div>
        {isUser && (
           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <UserCircleIcon className="w-5 h-5 text-sky-400" />
          </div>
        )}
      </div>
      {!isUser && typeof message.cost === 'number' && message.cost > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-1.5 ml-11">
              <WalletIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>{message.cost.toLocaleString('fa-IR')} سکه کسر شد</span>
          </div>
      )}
    </div>
  );
};

export default ChatMessage;