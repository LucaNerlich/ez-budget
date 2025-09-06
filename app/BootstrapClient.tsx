"use client";

import {useEffect} from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          await navigator.serviceWorker.register('/sw.js');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Service worker registration failed', e);
        }
      };
      // Register SW after page load to avoid blocking initial render
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register, { once: true });
    }
  }, []);
  return null;
}


