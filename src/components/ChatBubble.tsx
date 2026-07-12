// D:\nira-app\src\components\ChatBubble.tsx

import React from 'react';
import { IonText, useIonToast } from '@ionic/react';
import { useLocaleStore } from '../store/useLocaleStore';
import type { ChatMessage } from '../store/useChatStore';

interface ChatBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLast }) => {
  const { t } = useLocaleStore();
  const [presentToast] = useIonToast();
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      presentToast({ message: t('chatBubble.copySuccess') || 'Copied', duration: 1500, color: 'success' });
    } catch {
      presentToast({ message: t('chatBubble.copy') || 'Copy failed', duration: 1500, color: 'danger' });
    }
  };

  const handleDelete = () => {
    presentToast({ message: t('chatBubble.delete') || 'Deleted', duration: 1500, color: 'medium' });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
        padding: '0 16px',
      }}
    >
      <div
        onClick={handleCopy}
        onContextMenu={(e) => {
          e.preventDefault();
          if (isUser) handleDelete();
        }}
        style={{
          maxWidth: '75%',
          padding: '12px 16px',
          borderRadius: 18,
          backgroundColor: isUser ? '#F0D5C7' : '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          borderBottomRightRadius: isUser ? 4 : 18,
          borderBottomLeftRadius: isUser ? 18 : 4,
          cursor: 'pointer',
          wordBreak: 'break-word',
        }}
      >
        <IonText style={{ fontSize: 15, color: '#3D362F', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
          {message.content}
        </IonText>
      </div>
      <IonText style={{ fontSize: 11, color: '#8B7D72', marginTop: 4, padding: '0 4px' }}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </IonText>
    </div>
  );
};

export default ChatBubble;