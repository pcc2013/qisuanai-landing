// D:\nira-app\src\data\distillPricing.ts

export type CleaningLevel = 'light' | 'medium' | 'heavy' | 'enterprise';

export type DistillPricing = {
  cleaningLevel: CleaningLevel;
  price: number | null;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  disclaimerRequired: boolean;
  customPricing?: boolean;
  contactEmail?: string;
};

const distillPricingList: DistillPricing[] = [
  {
    cleaningLevel: 'heavy',
    price: 19999,
    subscriptionTier: 'basic',
    disclaimerRequired: true,
  },
  {
    cleaningLevel: 'medium',
    price: 39999,
    subscriptionTier: 'premium',
    disclaimerRequired: true,
  },
  {
    cleaningLevel: 'light',
    price: 99999,
    subscriptionTier: 'premium',
    disclaimerRequired: true,
  },
  {
    cleaningLevel: 'enterprise',
    price: null,
    subscriptionTier: 'enterprise',
    disclaimerRequired: false,
    customPricing: true,
    contactEmail: 'enterprise@qisuanai.com',
  },
];

export function getDistillPricing(level: CleaningLevel): DistillPricing & { contactEmail?: string } {
  const found = distillPricingList.find((p) => p.cleaningLevel === level);
  if (!found) {
    // Default to heavy
    return {
      cleaningLevel: 'heavy',
      price: 19999,
      subscriptionTier: 'basic',
      disclaimerRequired: true,
    };
  }
  return { ...found };
}

export default distillPricingList;