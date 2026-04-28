import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { runWhenIdle } from '@/lib/performance';

type ChatwootVisibility = 'show' | 'hide';

type ChatwootWindow = Window & {
  $chatwoot?: {
    toggleBubbleVisibility?: (visibility: ChatwootVisibility) => void;
  };
  chatwootSDK?: {
    run: (config: { websiteToken: string; baseUrl: string }) => void;
  };
};

const ADSENSE_SCRIPT_ID = 'tuwebai-adsense-script';
const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4693865721377675';
const REDCHAT_BASE_URL = 'https://app.redchat.com.ar';
const REDCHAT_SCRIPT_ID = 'tuwebai-redchat-script';
const REDCHAT_SCRIPT_SRC = `${REDCHAT_BASE_URL}/packs/js/sdk.js`;
const REDCHAT_WEBSITE_TOKEN = 'XnjSpBkQzweLHWCs89eerDt8';

const canLoadAdsenseForPath = (pathname: string): boolean =>
  pathname === '/blog' || pathname.startsWith('/blog/');

const toggleRedchatBubble = (
  chatWindow: ChatwootWindow,
  visibility: ChatwootVisibility,
) => {
  chatWindow.$chatwoot?.toggleBubbleVisibility?.(visibility);
};

export default function ThirdPartyScriptManager() {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    const chatWindow = window as ChatwootWindow;
    const onChatwootReady = () => {
      toggleRedchatBubble(chatWindow, 'show');
    };

    window.addEventListener('chatwoot:ready', onChatwootReady);

    if (chatWindow.$chatwoot) {
      toggleRedchatBubble(chatWindow, 'show');
    }

    if (!document.getElementById(REDCHAT_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = REDCHAT_SCRIPT_ID;
      script.src = REDCHAT_SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        chatWindow.chatwootSDK?.run({
          websiteToken: REDCHAT_WEBSITE_TOKEN,
          baseUrl: REDCHAT_BASE_URL,
        });
      };
      document.head.appendChild(script);
    }

    return () => {
      window.removeEventListener('chatwoot:ready', onChatwootReady);
      toggleRedchatBubble(chatWindow, 'hide');
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    const hostname = window.location.hostname;
    const isLocalEnvironment =
      hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';

    if (isLocalEnvironment || !canLoadAdsenseForPath(location.pathname)) {
      return;
    }

    const existingScript = document.getElementById(ADSENSE_SCRIPT_ID);
    if (existingScript) {
      return;
    }

    const loadAdsense = () => {
      if (document.getElementById(ADSENSE_SCRIPT_ID)) {
        return;
      }

      const script = document.createElement('script');
      script.id = ADSENSE_SCRIPT_ID;
      script.src = ADSENSE_SRC;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    };

    let cancelled = false;
    const scheduleLoad = () => {
      if (cancelled) {
        return;
      }

      runWhenIdle(loadAdsense, 4000);
    };

    const onUserIntent = () => {
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
      scheduleLoad();
    };

    window.addEventListener('pointerdown', onUserIntent, { passive: true, once: true });
    window.addEventListener('keydown', onUserIntent, { once: true });
    scheduleLoad();

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
    };
  }, [location.pathname]);

  return null;
}
