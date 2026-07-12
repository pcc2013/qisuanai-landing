// D:\nira-app\src\pages\AboutPage.tsx

import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonText, IonIcon, IonList, IonItem, IonLabel, IonButton,
} from '@ionic/react';
import {
  codeSlash, hardwareChipOutline, gitNetworkOutline,
  serverOutline, shieldCheckmarkOutline, documentTextOutline,
  cubeOutline, phonePortraitOutline, cloudOutline,
  brushOutline, chevronBackOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push('/settings')} style={{ '--color': '#3D362F' }}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>关于我们</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' }} className="ion-padding">
        {/* 项目信息 */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Nira 项目</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText style={{ fontSize: 14, color: '#3D362F', lineHeight: 1.8 }}>
              <p>Nira 是一款基于开源大模型的 AI 陪伴应用，由启算云 CogCloud 开发和维护。</p>
              <p>官方网站：qisuanai.com</p>
              <p>联系邮箱：admin@qisuanai.com</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* 对话与推理模型 */}
        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={hardwareChipOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              对话与推理模型
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList style={{ padding: 0 }} lines="full">
              <IonItem>
                <IonIcon icon={codeSlash} slot="start" color="primary" />
                <IonLabel>
                  <h3>Hermes 4-35B-A3B</h3>
                  <p>核心主对话模型（NousResearch，Apache 2.0）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={codeSlash} slot="start" color="primary" />
                <IonLabel>
                  <h3>Qwen3.6-14B</h3>
                  <p>轻量分流模型（Alibaba Cloud，Apache 2.0）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={serverOutline} slot="start" color="primary" />
                <IonLabel>
                  <h3>vLLM 0.4.2</h3>
                  <p>推理加速引擎（Apache 2.0）</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* 调度与框架 */}
        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={gitNetworkOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              调度与框架
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList style={{ padding: 0 }} lines="full">
              <IonItem>
                <IonIcon icon={gitNetworkOutline} slot="start" color="tertiary" />
                <IonLabel>
                  <h3>LangGraph</h3>
                  <p>多模型智能调度框架（LangChain，MIT License）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={gitNetworkOutline} slot="start" color="tertiary" />
                <IonLabel>
                  <h3>FastAPI</h3>
                  <p>API 网关与路由（Sebastián Ramírez，MIT License）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={serverOutline} slot="start" color="tertiary" />
                <IonLabel>
                  <h3>Redis</h3>
                  <p>业务会话与亲密度存储（BSD License）</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* 人格与人设系统 */}
        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={cubeOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              人格与人设系统
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList style={{ padding: 0 }} lines="full">
              <IonItem>
                <IonIcon icon={codeSlash} slot="start" color="success" />
                <IonLabel>
                  <h3>Sentence-BERT-large</h3>
                  <p>人设偏离度检测与语义相似度计算（UKP Lab，Apache 2.0）</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* 语言与语音 */}
        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={cloudOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              语言与语音
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList style={{ padding: 0 }} lines="full">
              <IonItem>
                <IonIcon icon={codeSlash} slot="start" color="warning" />
                <IonLabel>
                  <h3>NLLB 多语言翻译模型</h3>
                  <p>本地开源自动翻译，支持五语输出（Meta，MIT License）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={serverOutline} slot="start" color="warning" />
                <IonLabel>
                  <h3>CosyVoice-300M</h3>
                  <p>端侧实时语音合成（Alibaba，Apache 2.0）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={serverOutline} slot="start" color="warning" />
                <IonLabel>
                  <h3>OpenLess 语音输入工具</h3>
                  <p>端侧语音识别与转文字（Apache 2.0）</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* 数字人与视觉 */}
        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={phonePortraitOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              数字人与视觉
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList style={{ padding: 0 }} lines="full">
              <IonItem>
                <IonIcon icon={cubeOutline} slot="start" color="danger" />
                <IonLabel>
                  <h3>MuseTalk</h3>
                  <p>实时数字人口型生成与表情驱动（开源，Apache 2.0）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={brushOutline} slot="start" color="danger" />
                <IonLabel>
                  <h3>image2hub + gpt_image_2_skill</h3>
                  <p>AI 绘图套件，虚拟商品与场景生成（开源，Apache 2.0）</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* 前端框架 */}
        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={codeSlash} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              前端框架
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList style={{ padding: 0 }} lines="full">
              <IonItem>
                <IonIcon icon={shieldCheckmarkOutline} slot="start" color="primary" />
                <IonLabel>
                  <h3>React 18</h3>
                  <p>前端框架（Meta，MIT License）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={shieldCheckmarkOutline} slot="start" color="primary" />
                <IonLabel>
                  <h3>Ionic Framework 8</h3>
                  <p>移动端 UI 组件库（MIT License）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={shieldCheckmarkOutline} slot="start" color="primary" />
                <IonLabel>
                  <h3>Zustand</h3>
                  <p>状态管理（MIT License）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={shieldCheckmarkOutline} slot="start" color="primary" />
                <IonLabel>
                  <h3>Firebase Authentication</h3>
                  <p>用户认证服务（Google，Apache 2.0）</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={shieldCheckmarkOutline} slot="start" color="primary" />
                <IonLabel>
                  <h3>Capacitor</h3>
                  <p>跨平台原生打包（MIT License）</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* 法律声明 */}
        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={documentTextOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              法律声明
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText style={{ fontSize: 13, color: '#3D362F', lineHeight: 1.8 }}>
              <p>1. Nira 所使用的开源模型均遵循其原始许可证条款，包括但不限于 Apache 2.0、MIT、BSD 许可证。</p>
              <p>2. 开源模型的版权归各自原作者或组织所有，Nira 不对开源模型的准确性、完整性或适用性作任何保证。</p>
              <p>3. 用户上传的个人数据仅用于 AI 分身蒸馏功能，数据处理严格遵循反蒸馏安全机制。</p>
              <p>4. 数据存储于新加坡服务器，严格遵守新加坡《个人资料保护法令》(PDPA)。</p>
              <p>5. 未成年用户需在监护人同意下使用本应用。</p>
              <p>6. 本应用不提供医疗诊断、法律建议或投资咨询服务。</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AboutPage;