// D:\nira-app\src\pages\MyAiPage.tsx

import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonIcon, IonText, IonGrid, IonRow, IonCol,
  useIonToast, IonBadge, IonChip, IonModal, IonSpinner,
} from '@ionic/react';
import {
  heartOutline, heart, peopleOutline, people, flameOutline, flame,
  diamondOutline, shareOutline, cashOutline, cardOutline,
} from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { useChatStore } from '../store/useChatStore';
import { useQSStore } from '../store/useQSStore';

// ===== My AI 记忆卡片系统 =====

interface MemoryCard {
  id: string;
  type: 'friend' | 'close' | 'lover' | 'nira';
  title: string;
  subtitle: string;
  icon: string;
  unlocked: boolean;
  intimacyRequired: number;
}

const NIRA_CARD_PRICE = 520;

const MyAiPage: React.FC = () => {
  const { t } = useLocaleStore();
  const { intimacy } = useChatStore();
  const { qsBalance, deductQS } = useQSStore();
  const [presentToast] = useIonToast();

  const [showNiraConfirm, setShowNiraConfirm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasNiraCard, setHasNiraCard] = useState(false);

  // 三张基础卡
  const baseCards: MemoryCard[] = [
    {
      id: 'friend',
      type: 'friend',
      title: '朋友卡',
      subtitle: '初识之谊',
      icon: '👋',
      unlocked: intimacy.level >= 0,
      intimacyRequired: 0,
    },
    {
      id: 'close',
      type: 'close',
      title: '密友卡',
      subtitle: '相知相伴',
      icon: '🤝',
      unlocked: intimacy.level >= 3,
      intimacyRequired: 3,
    },
    {
      id: 'lover',
      type: 'lover',
      title: '恋人卡',
      subtitle: '心动时刻',
      icon: '💕',
      unlocked: intimacy.level >= 7,
      intimacyRequired: 7,
    },
  ];

  const allBaseUnlocked = baseCards.every((c) => c.unlocked);
  const canGenerateNira = allBaseUnlocked && !hasNiraCard;

  const handleGenerateNira = () => {
    if (qsBalance < NIRA_CARD_PRICE) {
      presentToast({ message: `QS 不足，需要 ${NIRA_CARD_PRICE} QS`, duration: 2000, color: 'danger' });
      return;
    }
    setShowNiraConfirm(true);
  };

  const confirmGenerateNira = () => {
    setShowNiraConfirm(false);
    setIsGenerating(true);
    deductQS(NIRA_CARD_PRICE, 'Generate Nira Card');

    setTimeout(() => {
      setIsGenerating(false);
      setHasNiraCard(true);
      presentToast({ message: '🎉 Nira 卡已生成！你已成为平台合伙人！', duration: 3000, color: 'success' });
    }, 3000);
  };

  const handleShare = () => {
    presentToast({ message: '已复制分享链接，炫耀你的 Nira 卡吧！', duration: 2000, color: 'success' });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonMenuButton style={{ '--color': '#3D362F' }} />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            <IonIcon icon={cardOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            My AI
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' }} className="ion-padding">
        {/* 亲密度进度 */}
        <IonCard style={{ background: 'linear-gradient(135deg, #F8E8E0, #F0D8D0)', textAlign: 'center' }}>
          <IonCardContent>
            <IonText style={{ fontSize: 14, color: '#8B7D72' }}>当前亲密度</IonText>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#C4A882', margin: '8px 0' }}>
              Lv.{intimacy.level}
            </div>
            <IonBadge color="medium">{intimacy.level >= 10 ? '灵魂伴侣' : intimacy.level >= 7 ? '恋人' : intimacy.level >= 3 ? '密友' : '朋友'}</IonBadge>
          </IonCardContent>
        </IonCard>

        {/* 三张基础卡 */}
        <IonText style={{ fontSize: 14, fontWeight: 600, color: '#3D362F', display: 'block', margin: '16px 0 8px' }}>
          基础记忆卡
        </IonText>
        <IonGrid>
          <IonRow>
            {baseCards.map((card) => (
              <IonCol key={card.id} size="4">
                <IonCard style={{
                  textAlign: 'center',
                  padding: 12,
                  opacity: card.unlocked ? 1 : 0.4,
                  filter: card.unlocked ? 'none' : 'grayscale(100%)',
                  border: card.unlocked ? '2px solid #C4A882' : '1px solid #E0D8CE',
                }}>
                  <div style={{ fontSize: 40 }}>{card.icon}</div>
                  <IonText style={{ fontSize: 13, fontWeight: 600, color: '#3D362F', display: 'block' }}>
                    {card.title}
                  </IonText>
                  <IonText style={{ fontSize: 10, color: '#8B7D72' }}>{card.subtitle}</IonText>
                  {!card.unlocked && (
                    <IonChip outline color="warning" style={{ fontSize: 10, marginTop: 4 }}>
                      亲密度 Lv.{card.intimacyRequired}+
                    </IonChip>
                  )}
                  {card.unlocked && (
                    <IonChip color="success" style={{ fontSize: 10, marginTop: 4 }}>已解锁</IonChip>
                  )}
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Nira 卡 */}
        <IonCard style={{
          marginTop: 16,
          textAlign: 'center',
          background: hasNiraCard
            ? 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)'
            : 'linear-gradient(135deg, #E0D8CE, #C0B8A8)',
          border: hasNiraCard ? '3px solid #FFD700' : '1px solid #E0D8CE',
        }}>
          <IonCardHeader>
            <IonIcon icon={diamondOutline} style={{ fontSize: 48, color: hasNiraCard ? '#fff' : '#8B7D72' }} />
            <IonCardTitle style={{ color: hasNiraCard ? '#fff' : '#8B7D72', marginTop: 8 }}>
              {hasNiraCard ? '🌟 Nira 卡' : 'Nira 卡'}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {hasNiraCard ? (
              <>
                <IonText style={{ color: '#fff', fontSize: 14 }}>
                  <p>🎉 恭喜！你已是 Nira 平台合伙人</p>
                  <p>享受平台收益分红 · 可交易 · 可分享</p>
                </IonText>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                  <IonButton size="small" onClick={handleShare} style={{ '--background': '#fff', '--color': '#FFA500' }}>
                    <IonIcon icon={shareOutline} slot="start" /> 分享炫耀
                  </IonButton>
                </div>
              </>
            ) : allBaseUnlocked ? (
              <>
                <IonText style={{ color: '#3D362F', fontSize: 14 }}>
                  <p>集齐三张基础卡，即可生成独一无二的 Nira 卡</p>
                  <IonBadge color="warning">{NIRA_CARD_PRICE} QS</IonBadge>
                </IonText>
                <IonButton
                  expand="block"
                  onClick={handleGenerateNira}
                  disabled={isGenerating}
                  style={{ marginTop: 12, '--background': '#FFA500' }}
                >
                  {isGenerating ? (
                    <>
                      <IonSpinner name="crescent" /> 生成中...
                    </>
                  ) : (
                    <>
                      <IonIcon icon={diamondOutline} slot="start" />
                      生成 Nira 卡 · {NIRA_CARD_PRICE} QS
                    </>
                  )}
                </IonButton>
              </>
            ) : (
              <IonText style={{ color: '#8B7D72', fontSize: 13 }}>
                <p>集齐朋友卡、密友卡、恋人卡后解锁</p>
                <p>需要亲密度达到 Lv.7</p>
              </IonText>
            )}
          </IonCardContent>
        </IonCard>

        {/* 合伙人权益说明 */}
        {hasNiraCard && (
          <IonCard style={{ marginTop: 12 }}>
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: 14 }}>
                <IonIcon icon={cashOutline} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                合伙人权益
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText style={{ fontSize: 13, color: '#3D362F' }}>
                <p>✅ 平台季度收益分红</p>
                <p>✅ Nira 卡可挂单交易</p>
                <p>✅ 专属合伙人标识</p>
                <p>✅ 优先体验新功能</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* Nira 卡确认弹窗 */}
        <IonModal isOpen={showNiraConfirm} onDidDismiss={() => setShowNiraConfirm(false)}>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <IonIcon icon={diamondOutline} style={{ fontSize: 48, color: '#FFA500' }} />
            <IonText style={{ fontSize: 18, fontWeight: 600, color: '#3D362F', display: 'block', margin: '16px 0 8px' }}>
              确认生成 Nira 卡？
            </IonText>
            <IonText style={{ fontSize: 14, color: '#8B7D72' }}>
              消耗 {NIRA_CARD_PRICE} QS · 生成后成为平台合伙人
            </IonText>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center' }}>
              <IonButton fill="outline" onClick={() => setShowNiraConfirm(false)}>取消</IonButton>
              <IonButton onClick={confirmGenerateNira} style={{ '--background': '#FFA500' }}>确认生成</IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MyAiPage;