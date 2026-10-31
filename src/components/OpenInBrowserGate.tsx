import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, MoreHorizontal, Smartphone } from "lucide-react";

/** Full-screen pre-page shown inside TikTok/Instagram browsers asking the visitor to open the real browser. */
export function OpenInBrowserGate({ onSkip }: { onSkip: () => void }) {
  const [os, setOs] = useState<"android" | "ios" | "other">("other");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setOs(/Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) ? "ios" : "other");
  }, []);

  const url = typeof window !== "undefined" ? window.location.href : "";

  const openBrowser = () => {
    if (os === "android") {
      const clean = url.replace(/^https?:\/\//, "");
      window.location.href = `intent://${clean}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
    } else if (os === "ios") {
      window.location.href = `x-safari-${url}`;
    } else {
      window.open(url, "_blank");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-6 py-10">
      {/* Arrow pointing to TikTok's "..." menu */}
      <motion.div
        className="absolute right-5 top-3 flex flex-col items-end text-primary"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="drop-shadow-[0_0_10px_currentColor]">
          <path d="M8 44 C 20 30, 30 20, 40 8 M40 8 L 28 10 M40 8 L 38 20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-sm rounded-2xl p-6 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary glow">
          <Smartphone className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">
          Abra no seu <span className="text-primary text-glow">navegador</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O navegador do TikTok trava a apresentação e o WhatsApp. Leva 2 segundos:
        </p>

        <ol className="mt-5 space-y-3 text-left text-sm">
          <li className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">1</span>
            <span>
              Toque nos <MoreHorizontal className="inline h-4 w-4 align-middle" /> no canto de cima
            </span>
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">2</span>
            <span>
              Escolha <b>"Abrir no navegador"</b>
            </span>
          </li>
        </ol>

        <button
          onClick={openBrowser}
          className="pulse-cta mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-bold text-primary-foreground"
        >
          <ExternalLink className="h-5 w-5" /> Abrir no navegador
        </button>
        <button
          onClick={copy}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium"
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          {copied ? "Link copiado! Cole no Chrome/Safari" : "Copiar link"}
        </button>
        <button onClick={onSkip} className="mt-4 text-xs text-muted-foreground underline">
          Continuar aqui mesmo
        </button>
      </motion.div>
    </div>
  );
}
