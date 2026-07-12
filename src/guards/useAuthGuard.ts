// D:\nira-app\src\guards\useAuthGuard.ts

import { useAuthStore } from '../store/useAuthStore';
import { useLoginModalStore } from '../store/useLoginModalStore';

type AuthRequiredAction = 'send_message' | 'voice_call' | 'video_call' | 'create_avatar';

export function useAuthGuard() {
  const { loggedIn } = useAuthStore();
  const { showLoginModal } = useLoginModalStore();

  function guard(action: AuthRequiredAction): boolean {
    if (loggedIn) return true;
    showLoginModal();
    return false;
  }

  return { guard, loggedIn };
}