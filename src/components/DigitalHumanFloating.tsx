// D:\nira-app\src\components\DigitalHumanFloating.tsx

import React, { useState, useRef, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { personOutline, closeOutline } from 'ionicons/icons';
import { usePersonaStore, PERSONA_CONFIGS } from '../store/usePersonaStore';

const DigitalHumanFloating: React.FC = () => {
  const { currentPersonaId, currentCharacterId } = usePersonaStore();
  const [isHidden, setIsHidden] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // 安全取值
  const config = (PERSONA_CONFIGS || []).find(p => p.id === currentPersonaId);
  const chars = config?.characters || [];
  const currentChar = chars.find(c => c.id === currentCharacterId) || chars[0];

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setPosition({ x: w - 60, y: h - 160 });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    let nx = e.clientX - offset.current.x;
    let ny = e.clientY - offset.current.y;
    ny = Math.max(56, Math.min(h - 200, ny));
    if (nx < w / 2) nx = 0;
    else nx = w - 60;
    setPosition({ x: nx, y: ny });
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  if (isHidden) return null;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 50,
        width: 44,
        height: 44,
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {currentChar?.avatar ? (
        <img
          src={currentChar.avatar}
          alt=""
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }}
        />
      ) : (
        <IonIcon icon={personOutline} style={{ fontSize: 24, color: '#C4A882' }} />
      )}
      <div
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: '#E88B7D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsHidden(true);
        }}
      >
        <IonIcon icon={closeOutline} style={{ fontSize: 12, color: '#fff' }} />
      </div>
    </div>
  );
};

export default DigitalHumanFloating;