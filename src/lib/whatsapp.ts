export const WHATSAPP = "5531998424986";
export const MSG =
  "Olá! Vi a apresentação do ecossistema de delivery próprio e gostaria de ver uma demonstração prática pro meu restaurante.";
export const WA_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(MSG)}`;

const query = `phone=${WHATSAPP}&text=${encodeURIComponent(MSG)}`;

/** In-app browsers (TikTok, Instagram, Facebook...) that often show a blank page for WhatsApp links. */
export function isInAppBrowser(ua = navigator.userAgent) {
  return /musical_ly|Bytedance|BytedanceWebview|TikTok|Instagram|FBAN|FBAV|FB_IAB|Line\/|Snapchat|Twitter/i.test(ua);
}

/**
 * Opens the WhatsApp app directly (skipping the api.whatsapp.com page that
 * renders blank inside TikTok). Returns true when a mobile deep link was tried.
 */
export function openWhatsAppApp(ua = navigator.userAgent): boolean {
  if (/Android/i.test(ua)) {
    // No package -> works for both WhatsApp and WhatsApp Business.
    window.location.href = `intent://send?${query}#Intent;scheme=whatsapp;S.browser_fallback_url=${encodeURIComponent(WA_URL)};end`;
    return true;
  }
  if (/iPhone|iPad|iPod/i.test(ua)) {
    window.location.href = `whatsapp://send?${query}`;
    return true;
  }
  return false;
}
