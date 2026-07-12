// D:\nira-app\src\pages\WardrobePage.tsx

import React, { useState, useCallback } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonButton, IonIcon, IonText, IonCard, IonCardContent,
  IonSegment, IonSegmentButton, IonLabel, IonBadge, IonChip,
  IonModal, IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonAvatar, useIonToast, IonFab, IonFabButton,
} from '@ionic/react';
import { cartOutline, addOutline, sparkles, personOutline, closeOutline, cameraOutline } from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { useQSStore } from '../store/useQSStore';
import { useMarketStore, CATEGORIES } from '../store/useMarketStore';

const WardrobePage: React.FC = () => {
  const { t } = useLocaleStore();
  const { qsBalance } = useQSStore();
  const {
    items, myUploads, myEarnings, limitedSales,
    uploadItem, buyItem, getByCategory, getLimitedStatus,
  } = useMarketStore();
  const [presentToast] = useIonToast();

  const [activeTab, setActiveTab] = useState<'market' | 'limited' | 'my'>('market');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);

  // 上传表单
  const [uploadName, setUploadName] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadPrice, setUploadPrice] = useState<number>(50);
  const [uploadCategory, setUploadCategory] = useState<string>('clothes');

  const limited = getLimitedStatus();

  const filteredItems = selectedCategory === 'all'
    ? items.filter((i) => i.status === 'approved')
    : getByCategory(selectedCategory);

  const handleBuy = useCallback((itemId: string) => {
    const success = buyItem(itemId);
    if (success) {
      presentToast({ message: '购买成功！', duration: 1500, color: 'success' });
    } else {
      presentToast({ message: t('insufficient_qs') || 'QS不足', duration: 2000, color: 'danger' });
    }
  }, [buyItem, presentToast, t]);

  const handleUpload = useCallback(() => {
    if (!uploadName.trim() || uploadPrice < 30 || uploadPrice > 500) {
      presentToast({ message: '请填写完整信息，价格范围 30-500 QS', duration: 2000, color: 'warning' });
      return;
    }
    uploadItem({
      creatorId: 'current_user',
      creatorName: '我',
      creatorAvatar: '/nira_logo.png',
      category: uploadCategory,
      name: uploadName.trim(),
      description: uploadDesc.trim(),
      imageUrl: '/nira_logo.png',
      price: uploadPrice,
    });
    setShowUpload(false);
    setUploadName('');
    setUploadDesc('');
    setUploadPrice(50);
    presentToast({ message: '上传成功！审核通过后自动上架', duration: 2000, color: 'success' });
  }, [uploadName, uploadDesc, uploadPrice, uploadCategory, uploadItem, presentToast]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonMenuButton style={{ '--color': '#3D362F' }} />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            <IonIcon icon={sparkles} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            AI 橱窗
          </IonTitle>
        </IonToolbar>
        <IonSegment
          value={activeTab}
          onIonChange={(e) => setActiveTab(e.detail.value as 'market' | 'limited' | 'my')}
          style={{ background: '#DCE8F0' }}
        >
          <IonSegmentButton value="market">创作者市场</IonSegmentButton>
          <IonSegmentButton value="limited">限定款</IonSegmentButton>
          <IonSegmentButton value="my">我的上传</IonSegmentButton>
        </IonSegment>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' }}>
        {/* Tab 1：创作者市场 */}
        {activeTab === 'market' && (
          <>
            <div style={{ padding: '8px 16px 0', display: 'flex', gap: 6, overflowX: 'auto', flexWrap: 'nowrap' }}>
              <IonChip
                outline={selectedCategory !== 'all'}
                color={selectedCategory === 'all' ? 'primary' : 'medium'}
                onClick={() => setSelectedCategory('all')}
                style={{ flexShrink: 0 }}
              >
                全部
              </IonChip>
              {CATEGORIES.map((cat) => (
                <IonChip
                  key={cat.key}
                  outline={selectedCategory !== cat.key}
                  color={selectedCategory === cat.key ? 'primary' : 'medium'}
                  onClick={() => setSelectedCategory(cat.key)}
                  style={{ flexShrink: 0 }}
                >
                  {cat.label}
                </IonChip>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 16 }}>
              {filteredItems.length === 0 ? (
                <div style={{ width: '100%', textAlign: 'center', padding: 40 }}>
                  <IonText color="medium">暂无创作者作品，快来上传第一个吧！</IonText>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <IonCard key={item.id} style={{ width: '45%', margin: 0, borderRadius: 12, backgroundColor: '#fff' }}>
                    <IonCardContent style={{ padding: 12, textAlign: 'center' }}>
                      <div style={{ width: '100%', height: 100, backgroundColor: '#F0EDE8', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                        <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <IonText style={{ fontSize: 12, color: '#3D362F', display: 'block', fontWeight: 600 }}>
                        {item.name}
                      </IonText>
                      <IonBadge color="warning" style={{ fontSize: 10, margin: '4px 0' }}>
                        {item.price} QS
                      </IonBadge>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
                        <IonAvatar style={{ width: 16, height: 16 }}>
                          <img src={item.creatorAvatar || '/nira_logo.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }} />
                        </IonAvatar>
                        <IonText style={{ fontSize: 10, color: '#8B7D72' }}>{item.creatorName}</IonText>
                      </div>
                      <IonButton
                        size="small"
                        expand="block"
                        onClick={() => handleBuy(item.id)}
                        disabled={qsBalance < item.price}
                        style={{ fontSize: 11, height: 28 }}
                      >
                        <IonIcon icon={cartOutline} slot="start" />
                        购买
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                ))
              )}
            </div>
          </>
        )}

        {/* Tab 2：平台限定款 */}
        {activeTab === 'limited' && (
          <div style={{ padding: 16, textAlign: 'center' }}>
            <IonCard style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: 'white',
              padding: 24,
              borderRadius: 16,
            }}>
              <IonIcon icon={sparkles} style={{ fontSize: 48, color: 'white' }} />
              <IonText style={{ fontSize: 22, fontWeight: 700, color: 'white', display: 'block', margin: '12px 0' }}>
                限定款
              </IonText>
              <IonText style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', display: 'block' }}>
                平台不定期发行限定款虚拟商品
              </IonText>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 16 }}>
                <IonBadge color="light" style={{ fontSize: 12 }}>已售 {limited.sold}/{limited.total}</IonBadge>
              </div>
              <IonButton
                expand="block"
                onClick={() => {
                  buyItem('platform_limited');
                  presentToast({
                    message: limited.available ? '限定款购买成功！' : '限定款已售罄',
                    duration: 2000,
                    color: limited.available ? 'success' : 'medium',
                  });
                }}
                disabled={!limited.available || qsBalance < 500}
                style={{ marginTop: 16, '--background': 'white', '--color': '#FFA500', fontWeight: 700 }}
              >
                {limited.available ? '购买限定款 · 500 QS' : '已售罄'}
              </IonButton>
            </IonCard>
          </div>
        )}

        {/* Tab 3：我的上传 */}
        {activeTab === 'my' && (
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <IonBadge color="tertiary" style={{ fontSize: 12 }}>
                已上传 {myUploads.length} 件
              </IonBadge>
              <IonBadge color="success" style={{ fontSize: 12 }}>
                累计收益 {myEarnings} QS
              </IonBadge>
            </div>

            {myUploads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <IonText color="medium">你还没有上传作品，点击右下角 + 开始创作</IonText>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {myUploads.map((item) => (
                  <IonCard key={item.id} style={{ width: '45%', margin: 0, borderRadius: 12, backgroundColor: '#fff' }}>
                    <IonCardContent style={{ padding: 12, textAlign: 'center' }}>
                      <div style={{ width: '100%', height: 80, backgroundColor: '#F0EDE8', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                        👗
                      </div>
                      <IonText style={{ fontSize: 12, color: '#3D362F', display: 'block', fontWeight: 600 }}>
                        {item.name}
                      </IonText>
                      <IonBadge color="warning" style={{ fontSize: 10, margin: '4px 0' }}>
                        {item.price} QS
                      </IonBadge>
                      <IonText style={{ fontSize: 10, color: '#8B7D72' }}>
                        已售 {item.salesCount} 次
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 上传按钮 */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ marginBottom: 16, marginRight: 16 }}>
          <IonFabButton
            onClick={() => setShowUpload(true)}
            style={{ '--background': '#C4A882' }}
          >
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* 上传弹窗 */}
        <IonModal isOpen={showUpload} onDidDismiss={() => setShowUpload(false)}>
          <IonHeader>
            <IonToolbar style={{ '--background': '#DCE8F0' }}>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowUpload(false)} style={{ '--color': '#3D362F' }}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
              <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>上传作品</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent style={{ '--background': '#F5F0EB' }} className="ion-padding">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* 图片上传区域 */}
              <div style={{
                width: '100%', height: 200, backgroundColor: '#F0EDE8',
                borderRadius: 12, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column',
                border: '2px dashed #E0D8CE', cursor: 'pointer',
              }}>
                <IonIcon icon={cameraOutline} style={{ fontSize: 48, color: '#8B7D72' }} />
                <IonText style={{ fontSize: 14, color: '#8B7D72', marginTop: 8 }}>
                  点击上传图片（功能即将开放）
                </IonText>
              </div>

              <IonSelect
                value={uploadCategory}
                onIonChange={(e) => setUploadCategory(e.detail.value)}
                placeholder="选择品类"
                interface="action-sheet"
                style={{ backgroundColor: '#fff', borderRadius: 12, padding: '8px 16px' }}
              >
                {CATEGORIES.map((cat) => (
                  <IonSelectOption key={cat.key} value={cat.key}>{cat.label}</IonSelectOption>
                ))}
              </IonSelect>

              <IonInput
                value={uploadName}
                onIonChange={(e) => setUploadName(e.detail.value || '')}
                placeholder="作品名称"
                style={{ backgroundColor: '#fff', borderRadius: 12, padding: '8px 16px', fontSize: 14 }}
              />

              <IonTextarea
                value={uploadDesc}
                onIonChange={(e) => setUploadDesc(e.detail.value || '')}
                placeholder="作品描述（选填）"
                rows={2}
                style={{ backgroundColor: '#fff', borderRadius: 12, padding: '8px 16px', fontSize: 14 }}
              />

              <div>
                <IonText style={{ fontSize: 12, color: '#8B7D72', display: 'block', marginBottom: 4 }}>
                  价格设置（30-500 QS）
                </IonText>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="range"
                    min={30}
                    max={500}
                    step={10}
                    value={uploadPrice}
                    onChange={(e) => setUploadPrice(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <IonBadge color="warning" style={{ fontSize: 14, minWidth: 70, textAlign: 'center' }}>
                    {uploadPrice} QS
                  </IonBadge>
                </div>
              </div>

              <IonButton
                expand="block"
                onClick={handleUpload}
                style={{ '--background': '#C4A882', marginTop: 8 }}
              >
                提交上传
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default WardrobePage;