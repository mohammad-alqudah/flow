import { create } from "zustand";

type Store = {
  count: number;
  inc: () => void;
};

const useCounter = create<Store>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

export default useCounter;
