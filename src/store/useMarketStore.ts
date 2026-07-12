// D:\nira-app\src\store\useMarketStore.ts（完整版，已加本地审核逻辑）

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useQSStore } from './useQSStore';

export interface MarketItem {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  category: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  salesCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export const CATEGORIES = [
  { key: 'clothes', label: '服装' },
  { key: 'shoes', label: '鞋子' },
  { key: 'jewelry', label: '首饰' },
  { key: 'bags', label: '包包' },
  { key: 'accessories', label: '配饰' },
  { key: 'makeup', label: '妆容' },
  { key: 'hairstyle', label: '发型' },
  { key: 'sets', label: '套装' },
];

const LIMITED_PRICE = 500;
const LIMITED_TOTAL = 100;
const PLATFORM_FEE = 0.2;

// ===== 审核规则（本地运行） =====
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_PRICE = 30;
const MAX_PRICE = 500;
const BLOCKED_WORDS = ['赌博', '色情', 'casino', 'porn', 'xxx']; // 可扩展

interface AuditResult {
  passed: boolean;
  reason?: string;
}

function auditItem(item: Omit<MarketItem, 'id' | 'status' | 'salesCount' | 'createdAt'> & { imageFile?: File }): AuditResult {
  // 1. 名称必填
  if (!item.name.trim()) {
    return { passed: false, reason: '作品名称不能为空' };
  }

  // 2. 名称长度限制
  if (item.name.length > 30) {
    return { passed: false, reason: '作品名称不能超过30个字符' };
  }

  // 3. 违禁词检查
  const lowerName = item.name.toLowerCase();
  const lowerDesc = (item.description || '').toLowerCase();
  for (const word of BLOCKED_WORDS) {
    if (lowerName.includes(word) || lowerDesc.includes(word)) {
      return { passed: false, reason: `包含违规词汇: ${word}` };
    }
  }

  // 4. 价格范围
  if (item.price < MIN_PRICE || item.price > MAX_PRICE) {
    return { passed: false, reason: `价格范围应为 ${MIN_PRICE}-${MAX_PRICE} QS` };
  }

  // 5. 品类校验
  const validCategories = CATEGORIES.map(c => c.key);
  if (!validCategories.includes(item.category)) {
    return { passed: false, reason: '无效的商品品类' };
  }

  // 6. 图片格式（如果有 File 对象）
  if (item.imageFile) {
    if (!ALLOWED_IMAGE_TYPES.includes(item.imageFile.type)) {
      return { passed: false, reason: '仅支持 PNG/JPEG/WebP 格式图片' };
    }
    if (item.imageFile.size > MAX_IMAGE_SIZE) {
      return { passed: false, reason: '图片大小不能超过 5MB' };
    }
  }

  // 7. 图片 URL 必须有值（如果没有 File，至少要有 imageUrl）
  if (!item.imageUrl || item.imageUrl.trim() === '') {
    return { passed: false, reason: '请上传作品图片' };
  }

  return { passed: true };
}

// ===== Store =====
interface MarketState {
  items: MarketItem[];
  myUploads: MarketItem[];
  myEarnings: number;
  limitedSales: number;
  isLoading: boolean;

  uploadItem: (item: Omit<MarketItem, 'id' | 'status' | 'salesCount' | 'createdAt'> & { imageFile?: File }) => { success: boolean; reason?: string };
  buyItem: (itemId: string) => boolean;
  getByCategory: (category: string) => MarketItem[];
  getLimitedStatus: () => { sold: number; total: number; available: boolean };
}

function genId(): string {
  return `market_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      items: [],
      myUploads: [],
      myEarnings: 0,
      limitedSales: 0,
      isLoading: false,

      uploadItem: (item) => {
        // 执行审核
        const result = auditItem(item);
        if (!result.passed) {
          return { success: false, reason: result.reason };
        }

        const newItem: MarketItem = {
          creatorId: item.creatorId,
          creatorName: item.creatorName,
          creatorAvatar: item.creatorAvatar,
          category: item.category,
          name: item.name.trim(),
          description: (item.description || '').trim(),
          imageUrl: item.imageUrl,
          price: item.price,
          id: genId(),
          status: 'approved',
          salesCount: 0,
          createdAt: Date.now(),
        };

        set((state) => ({
          items: [newItem, ...state.items],
          myUploads: [newItem, ...state.myUploads],
        }));

        return { success: true };
      },

      buyItem: (itemId: string) => {
        const item = get().items.find((i) => i.id === itemId);
        if (!item) return false;

        if (item.creatorId === 'platform') {
          const { limitedSales } = get();
          if (limitedSales >= LIMITED_TOTAL) return false;
          const deducted = useQSStore.getState().deductQS(LIMITED_PRICE, '购买平台限定款');
          if (!deducted) return false;
          set((state) => ({
            limitedSales: state.limitedSales + 1,
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, salesCount: i.salesCount + 1 } : i
            ),
          }));
          return true;
        }

        const deducted = useQSStore.getState().deductQS(item.price, `购买 ${item.name}`);
        if (!deducted) return false;

        const creatorShare = Math.floor(item.price * (1 - PLATFORM_FEE));

        set((state) => ({
          myEarnings: item.creatorId === 'current_user'
            ? state.myEarnings + creatorShare
            : state.myEarnings,
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, salesCount: i.salesCount + 1 } : i
          ),
        }));

        return true;
      },

      getByCategory: (category: string) => {
        return get().items.filter(
          (i) => i.category === category && i.status === 'approved'
        );
      },

      getLimitedStatus: () => ({
        sold: get().limitedSales,
        total: LIMITED_TOTAL,
        available: get().limitedSales < LIMITED_TOTAL,
      }),
    }),
    {
      name: 'nira-market-store',
      partialize: (state) => ({
        items: state.items,
        myUploads: state.myUploads,
        myEarnings: state.myEarnings,
        limitedSales: state.limitedSales,
      }),
    }
  )
);