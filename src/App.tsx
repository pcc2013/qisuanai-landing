// D:\nira-app\src\App.tsx

import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import CallPage from './pages/CallPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LegalPage from './pages/LegalPage';
import ExclusiveAvatarPage from './pages/ExclusiveAvatarPage';
import CustomizePage from './pages/CustomizePage';
import DigitalHumanPage from './pages/DigitalHumanPage';
import EnterprisePage from './pages/EnterprisePage';
import SubscribePage from './pages/SubscribePage';
import WardrobePage from './pages/WardrobePage';
import BlindBoxPage from './pages/BlindBoxPage';
import MemoryCardPage from './pages/MemoryCardPage';
import DiaryPage from './pages/DiaryPage';
import InvitePage from './pages/InvitePage';
import CreatorPage from './pages/CreatorPage';
import RechargePage from './pages/RechargePage';
import AiVideoPage from './pages/AiVideoPage';
import MyAiPage from './pages/MyAiPage';
import AboutPage from './pages/AboutPage';
import ProfileEditPage from './pages/ProfileEditPage';

import LoginModal from './components/LoginModal';
import { useAuthStore } from './store/useAuthStore';
import './locales/fullDictionary';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';

setupIonicReact({ mode: 'md', animated: true });

const App: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initAuthListener = useAuthStore((s) => s.initAuthListener);

  React.useEffect(() => {
    initAuthListener();
  }, []);

  const defaultRoute = isAuthenticated ? '/home' : '/register';

  return (
    <IonApp>
      <IonReactRouter>
        <LoginModal />
        <IonRouterOutlet animated={true}>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/chat/:personaId" component={ChatPage} />
          <Route exact path="/call/:callType/:targetId" component={CallPage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/legal/:file" component={LegalPage} />
          <Route exact path="/legal" component={() => <Redirect to="/legal/privacy-policy" />} />
          <Route exact path="/exclusive-avatar" component={ExclusiveAvatarPage} />
          <Route exact path="/customize" component={CustomizePage} />
          <Route exact path="/digital-human" component={DigitalHumanPage} />
          <Route exact path="/enterprise" component={EnterprisePage} />
          <Route exact path="/subscribe" component={SubscribePage} />
          <Route exact path="/wardrobe" component={WardrobePage} />
          <Route exact path="/blindbox" component={BlindBoxPage} />
          <Route exact path="/memory-card" component={MemoryCardPage} />
          <Route exact path="/diary" component={DiaryPage} />
          <Route exact path="/invite" component={InvitePage} />
          <Route exact path="/creator" component={CreatorPage} />
          <Route exact path="/recharge" component={RechargePage} />
          <Route exact path="/ai-video" component={AiVideoPage} />
          <Route exact path="/my-ai" component={MyAiPage} />
          <Route exact path="/my-diary" component={() => <Redirect to="/diary" />} />
          <Route exact path="/my-favorites" component={() => <Redirect to="/my-ai" />} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/profile/edit" component={ProfileEditPage} />
          <Redirect exact from="/" to={defaultRoute} />
          <Route path="*" component={() => <Redirect to={defaultRoute} />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;