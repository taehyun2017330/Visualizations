// store.js
import create from 'zustand';

const useStore2 = create(set => ({
    attributes: [],
    checkViz: false,
    setAttributes: (attrs) => set({ attributes: attrs }),
    setCheckViz: (status) => set({ checkViz: status }),
  }));

export default useStore2;
