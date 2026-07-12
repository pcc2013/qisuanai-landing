// D:\nira-app\src\components\QSBalanceBadge.tsx

import React, { useState } from 'react';
import { IonBadge, IonPopover, IonList, IonItem, IonLabel, IonText, IonSpinner } from '@ionic/react';
import { useQSStore } from '../store/useQSStore';
import { useLocaleStore } from '../store/useLocaleStore';
import { qsManagerAdapter } from '../adapters/qsManager';

export const QSBalanceBadge: React.FC = () => {
  const { qsBalance, isInsufficient } = useQSStore();
  const { t } = useLocaleStore();
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<React.MouseEvent | null>(null);

  const handleClick = async (e: React.MouseEvent) => {
    setPopoverEvent(e);
    setIsShowDetail(true);
    setLoading(true);
    try {
      const recs = await qsManagerAdapter.getConsumeRecords('');
      setRecords(recs.slice(0, 10));
    } catch {}
    setLoading(false);
  };

  return (
    <>
      <div onClick={handleClick} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
        <IonBadge style={{ backgroundColor: isInsufficient ? '#E88B7D' : '#C4A882', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 12 }}>
          {qsBalance} QS
        </IonBadge>
        {isInsufficient && <IonText style={{ fontSize: 10, color: '#E88B7D', marginLeft: 4 }}>{t('qsBalance.insufficient') || 'Low'}</IonText>}
      </div>
      <IonPopover isOpen={isShowDetail} event={popoverEvent!} onDidDismiss={() => setIsShowDetail(false)}>
        <IonList style={{ maxHeight: 300, overflowY: 'auto', minWidth: 200 }}>
          <IonItem lines="full"><IonLabel style={{ fontWeight: 600 }}>{t('qsBalance.title') || 'QS Balance'}: {qsBalance}</IonLabel></IonItem>
          {loading ? <IonItem><IonSpinner /></IonItem> : records.map((r) => (
            <IonItem key={r.id}>
              <IonLabel style={{ fontSize: 12 }}>
                <span style={{ color: r.amount > 0 ? '#4CAF50' : '#E88B7D' }}>{r.amount > 0 ? '+' : ''}{r.amount}</span>{' '}{r.reason}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonPopover>
    </>
  );
};
export default QSBalanceBadge;