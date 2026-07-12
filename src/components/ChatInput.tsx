// D:\nira-app\src\components\ChatInput.tsx

import React, { useState, useRef, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { send, mic, micOff } from 'ionicons/icons';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
      inputRef.current?.focus();
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = useCallback(async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('您的浏览器不支持语音输入，请使用系统键盘的语音按钮');
        setIsRecording(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => prev + transcript);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  }, [isRecording]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, padding: '8px 0' }}>
      {/* 输入框 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="说点什么..."
          rows={1}
          disabled={disabled}
          style={{
            width: '100%',
            resize: 'none',
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: '10px 16px',
            fontSize: 15,
            lineHeight: 1.4,
            border: 'none',
            outline: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            fontFamily: 'inherit',
            maxHeight: 120,
          }}
        />
      </div>

      {/* 语音按钮 */}
      <IonButton
        fill="clear"
        onClick={handleVoiceToggle}
        disabled={disabled}
        color={isRecording ? 'danger' : 'medium'}
        style={{
          margin: 0,
          width: 44,
          height: 44,
          '--padding-start': 0,
          '--padding-end': 0,
          '--border-radius': '50%',
          backgroundColor: isRecording ? '#FFEBEE' : '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}
      >
        <IonIcon icon={isRecording ? micOff : mic} style={{ fontSize: 20 }} />
      </IonButton>

      {/* 发送按钮 */}
      <IonButton
        fill="clear"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        style={{
          margin: 0,
          width: 44,
          height: 44,
          '--padding-start': 0,
          '--padding-end': 0,
          '--border-radius': '50%',
          backgroundColor: text.trim() ? '#C4A882' : '#F0EDE8',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          flexShrink: 0,
          transition: 'background-color 0.2s',
        }}
      >
        <IonIcon icon={send} style={{ fontSize: 20, color: text.trim() ? '#FFFFFF' : '#B0A89A' }} />
      </IonButton>
    </div>
  );
};

export default ChatInput;