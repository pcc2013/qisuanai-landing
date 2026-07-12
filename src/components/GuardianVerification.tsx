// D:\nira-app\src\components\GuardianVerification.tsx

import React, { useState } from 'react';
import { IonButton, IonText, IonSpinner } from '@ionic/react';
import { useLocaleStore } from '../store/useLocaleStore';

interface GuardianVerificationProps {
  onSuccess: () => void;
}

const QUESTIONS = [
  { q: 'Which street have you lived on?', options: ['Oak St', 'Pine Ave', 'Maple Dr', 'Cedar Ln', 'None'] },
  { q: 'Year phone first registered?', options: ['2015', '2017', '2019', '2021', 'None'] },
  { q: 'Associated company?', options: ['Tech Corp', 'Data Inc', 'Web LLC', 'Cloud Ltd', 'None'] },
];

export const GuardianVerification: React.FC<GuardianVerificationProps> = ({ onSuccess }) => {
  const { t } = useLocaleStore();
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const answer = (index: number) => {
    const isCorrect = index === 0; // Mock: first option is correct
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    const correctCount = isCorrect ? (answers.filter((a, i) => QUESTIONS[i]?.options[a] === QUESTIONS[i]?.options[0]).length + 1) : answers.filter((a, i) => QUESTIONS[i]?.options[a] === QUESTIONS[i]?.options[0]).length;

    if (currentQuestion >= 2 || correctCount >= 2) {
      onSuccess();
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <IonText style={{ fontSize: 16, fontWeight: 600, color: '#3D362F' }}>{t('guardianVerification.title') || 'Guardian Verification'}</IonText>
      <IonText style={{ fontSize: 13, color: '#8B7D72', display: 'block', margin: '8px 0 16px' }}>{t('guardianVerification.question') || 'Answer at least 2/3 correctly'}</IonText>
      {isLocked ? (
        <IonText color="warning">{t('guardianVerification.locked') || 'Too many attempts. Try later.'}</IonText>
      ) : (
        <>
          <IonText style={{ fontSize: 15, color: '#3D362F', marginBottom: 12, display: 'block' }}>{QUESTIONS[currentQuestion].q}</IonText>
          {QUESTIONS[currentQuestion].options.map((opt, i) => (
            <IonButton key={i} expand="block" fill="outline" onClick={() => answer(i)} style={{ '--border-color': '#E0D8CE', '--color': '#3D362F', marginBottom: 8, whiteSpace: 'normal' }}>
              {opt}
            </IonButton>
          ))}
        </>
      )}
    </div>
  );
};
export default GuardianVerification;