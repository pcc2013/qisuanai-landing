export type StreamEventType = 'reply' | 'asset_update' | 'intimacy_update' | 'memory_recall' | 'scene_trigger';

export interface DialogueRequest {
  session_id: string;
  user_id: string;
  message: string;
  mode: 'quick' | 'deep';
}

export interface ReplyEvent { text: string; emotion: string; }
export interface AssetUpdateEvent { asset_change: number; reason: string; }
export interface IntimacyUpdateEvent { level: number; change: number; }
export interface MemoryRecallEvent { fragments: Array<{ content: string; timestamp: string }>; }
export interface SceneTriggerEvent { scene_id: string; scene_name: string; }

export function connectDialogueStream(
  params: DialogueRequest,
  onReply: (data: ReplyEvent) => void,
  onAssetUpdate: (data: AssetUpdateEvent) => void,
  onIntimacyUpdate: (data: IntimacyUpdateEvent) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  onMemoryRecall?: (data: MemoryRecallEvent) => void,
  onSceneTrigger?: (data: SceneTriggerEvent) => void,
): AbortController {
  const controller = new AbortController();

  import('../adapters/apiClient').then(({ postDialogue }) => {
    postDialogue(params, controller.signal)
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`服务器错误 ${response.status}: ${errorText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('无法获取响应流');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) { onComplete(); break; }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                switch (data.event as StreamEventType) {
                  case 'reply': onReply(data.data as ReplyEvent); break;
                  case 'asset_update': onAssetUpdate(data.data as AssetUpdateEvent); break;
                  case 'intimacy_update': onIntimacyUpdate(data.data as IntimacyUpdateEvent); break;
                  case 'memory_recall': onMemoryRecall?.(data.data as MemoryRecallEvent); break;
                  case 'scene_trigger': onSceneTrigger?.(data.data as SceneTriggerEvent); break;
                }
              } catch (e) { console.error('[messageStream] SSE 解析错误:', e); }
            }
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('[messageStream] 流连接错误:', err);
          onError(err);
        }
      });
  });

  return controller;
}

export const messageStreamAdapter = {
  saveCallRecord: (record: {
    id: string;
    targetId: string;
    targetType: string;
    duration: number;
    consumedQS: number;
    time: string;
  }) => {
    console.log('[messageStreamAdapter] saveCallRecord:', record);
  },
};