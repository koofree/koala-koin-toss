import { SETTING_STORAGE_KEY } from '@/config';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingStore {
  soundEnabled: boolean;
  BGMEnabled: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
  setBGMEnabled: (bgmEnabled: boolean) => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      BGMEnabled: true,
      setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled }),
      setBGMEnabled: (BGMEnabled: boolean) => set({ BGMEnabled }),
    }),
    {
      name: `${SETTING_STORAGE_KEY}`,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Default export for backward compatibility
export default useSettingStore;
