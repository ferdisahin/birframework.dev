import '../css/app.css';
import { createBirApp } from './bir-inertia';

const pages = import.meta.glob('../../views/pages/**/*.tsx');

createBirApp({
  resolve: async (name) => {
    const normalized = name.replace(/\./g, '/');
    const loader = pages[`../../views/pages/${normalized}.tsx`];
    if (!loader) {
      throw new Error(`[BirJS] Page component not found: views/pages/${normalized}.tsx`);
    }
    return loader();
  },
});
