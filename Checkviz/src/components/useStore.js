// store.js
import create from 'zustand';

const useStore = create(set => ({
  attributes: [
  ],
  setAttributes: (newAttributes) => set({ attributes: newAttributes }),
}));



export default useStore;
