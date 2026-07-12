// D:\nira-app\src\pages\BlindBoxPage.tsx

import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonButton, IonIcon, IonText, IonCard, IonCardContent,
  useIonToast,
} from '@ionic/react';
import { giftOutline, sparkles } from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { useQSStore } from '../store/useQSStore';

// ===== 外观盲盒 经济模型 =====
const SINGLE_PRICE = 50;
const TEN_PRICE = 450;

const PROBABILITIES = [
  { label: '稀有皮肤', rate: 70 },
  { label: '限定场景', rate: 20 },
  { label: '绝版配饰', rate: 8 },
  { label: '传说特效妆容', rate: 2 },
];

const BlindBoxPage: React.FC = () => {
  const { t } = useLocaleStore();
  const { qsBalance, deductQS } = useQSStore();
  const [presentToast] = useIonToast();
  const [results, setResults] = useState<string[]>([]);
  const [isPulling, setIsPulling] = useState(false);

  const doPull = (count: number, totalPrice: number) => {
    if (qsBalance < totalPrice) {
      presentToast({ message: t('insufficient_qs') || 'QS不足', duration: 2000, color: 'danger' });
      return;
    }
    deductQS(totalPrice, `Blind Box ${count}× Pull`);
    setIsPulling(true);

    const pulls: string[] = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.random() * 100;
      if (rand < 70) pulls.push('稀有皮肤');
      else if (rand < 90) pulls.push('限定场景');
      else if (rand < 98) pulls.push('绝版配饰');
      else pulls.push('传说特效妆容');
    }

    setTimeout(() => {
      setResults(pulls);
      setIsPulling(false);
      presentToast({ message: '开盒成功！', duration: 1500, color: 'success' });
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonMenuButton style={{ '--color': '#3D362F' }} />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            <IonIcon icon={sparkles} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            外观盲盒
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        {/* 概率说明 */}
        <div style={{ padding: 16 }}>
          <IonText style={{ fontSize: 14, fontWeight: 600, color: '#3D362F', display: 'block', marginBottom: 8 }}>
            掉落概率
          </IonText>
          {PROBABILITIES.map((p) => (
            <IonText key={p.label} style={{ fontSize: 12, color: '#8B7D72', display: 'block' }}>
              {p.label}: {p.rate}%
            </IonText>
          ))}
        </div>

        {/* 开盒按钮 */}
        <div style={{ padding: '0 16px', display: 'flex', gap: 10, justifyContent: 'center' }}>
          <IonButton
            expand="block"
            size="large"
            onClick={() => doPull(1, SINGLE_PRICE)}
            disabled={isPulling}
            style={{ flex: 1, height: 56, fontSize: 14, fontWeight: 700 }}
          >
            <IonIcon icon={giftOutline} slot="start" />
            一次开 ({SINGLE_PRICE} QS)
          </IonButton>
          <IonButton
            expand="block"
            size="large"
            onClick={() => doPull(10, TEN_PRICE)}
            disabled={isPulling}
            style={{ flex: 1, height: 56, fontSize: 14, fontWeight: 700 }}
          >
            <IonIcon icon={giftOutline} slot="start" />
            十连开 ({TEN_PRICE} QS)
          </IonButton>
        </div>

        {/* 开盒结果 */}
        {results.length > 0 && (
          <div style={{ padding: 16 }}>
            <IonText style={{ fontSize: 14, fontWeight: 600, color: '#3D362F', display: 'block', marginBottom: 8 }}>
              开盒结果
            </IonText>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {results.map((r, i) => (
                <IonCard key={i} style={{ width: '30%', margin: 0, borderRadius: 8, backgroundColor: '#fff', textAlign: 'center', padding: 8 }}>
                  <div style={{ fontSize: 28 }}>🎁</div>
                  <IonText style={{ fontSize: 10, color: '#3D362F' }}>{r}</IonText>
                </IonCard>
              ))}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BlindBoxPage;