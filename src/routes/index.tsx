import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, ChefHat, Bike, Smartphone, MessageCircle,
  X, TrendingUp, Megaphone, RotateCcw, MapPin,
} from "lucide-react";

import { WA_URL, isInAppBrowser, openWhatsAppApp } from "@/lib/whatsapp";
import { OpenInBrowserGate } from "@/components/OpenInBrowserGate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Delivery Próprio — Pare de pagar 25% ao iFood" },
      { name: "description", content: "Sistema de delivery próprio para restaurantes: 0% comissão, Pix direto e cliente fiel à sua marca." },
      { property: "og:title", content: "Delivery Próprio — Pare de pagar 25% ao iFood" },
      { property: "og:description", content: "Cardápio web, painel da cozinha e app do motoboy. Calcule sua economia." },
    ],
  }),
  component: Index,
});

const STEPS = ["O Sangramento", "O Ecossistema", "Sua Economia", "Escala & Tráfego", "Demonstração"];
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Index() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const go = useCallback((n: number) => {
    setStep((s) => {
      const t = Math.max(0, Math.min(STEPS.length - 1, n));
      setDir(t > s ? 1 : -1);
      return t;
    });
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") setStep((s) => { setDir(1); return Math.min(STEPS.length - 1, s + 1); });
      if (e.key === "ArrowLeft") setStep((s) => { setDir(-1); return Math.max(0, s - 1); });
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Open the WhatsApp app directly on phones (TikTok's browser shows a blank page otherwise).
  const [waHelp, setWaHelp] = useState(false);
  const [inApp, setInApp] = useState(false);
  useEffect(() => { setInApp(isInAppBrowser()); }, []);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.("a[href^='https://api.whatsapp.com']");
      if (!a) return;
      if (!openWhatsAppApp()) return; // desktop: normal link
      e.preventDefault();
      const t = window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          if (isInAppBrowser()) setWaHelp(true);
          else window.location.href = WA_URL;
        }
      }, 1800);
      const cancel = () => { if (document.visibilityState === "hidden") window.clearTimeout(t); };
      document.addEventListener("visibilitychange", cancel, { once: true });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const next = ["Avançar: Conhecer a Solução", "Avançar: Calcular Minha Economia", "Avançar: Como Acelerar as Vendas", "Avançar: Ver Demonstração Privada"];

  const [skipGate, setSkipGate] = useState(false);
  if (inApp && !skipGate) return <OpenInBrowserGate onSkip={() => setSkipGate(true)} />;

  return (
    <div className="min-h-screen flex flex-col">
      {waHelp && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setWaHelp(false)}>
          <div className="glass rounded-2xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <MessageCircle className="size-10 text-primary mx-auto" />
            <h3 className="mt-3 text-xl font-bold">Abra no navegador</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              O navegador do TikTok bloqueia o WhatsApp. Toque nos <b>3 pontinhos (⋯)</b> no canto da tela e escolha <b>"Abrir no navegador"</b>, depois toque no botão de novo.
            </p>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
              className="mt-5 w-full rounded-xl bg-primary text-primary-foreground h-12 font-bold"
            >
              Copiar link do site
            </button>
            <button onClick={() => setWaHelp(false)} className="mt-3 text-sm text-muted-foreground">Fechar</button>
          </div>
        </div>
      )}
      {inApp && (
        <div className="relative z-30 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
            <Smartphone className="size-6 shrink-0" />
            <p className="flex-1 text-xs sm:text-sm font-semibold leading-snug">
              Para o WhatsApp funcionar, abra esta página no navegador: toque nos <b>3 pontinhos (⋯)</b> no canto da tela e escolha <b>"Abrir no navegador"</b>.
            </p>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
              className="shrink-0 rounded-lg bg-background/20 px-3 py-2 text-xs font-bold"
            >
              Copiar link
            </button>
            <button onClick={() => setInApp(false)} aria-label="Fechar aviso" className="shrink-0 p-1 opacity-80">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-20 glass border-x-0 border-t-0">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <nav className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <button key={s} onClick={() => go(i)} aria-label={`Etapa ${i + 1}: ${s}`} className="flex-1 py-2 text-left group">
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div className="h-full bg-primary" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                  </div>
                  <span className={`mt-1.5 hidden md:block text-[11px] font-medium whitespace-nowrap transition-colors ${i === step ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {String(i + 1).padStart(2, "0")}. {s}
                  </span>
                </button>
              ))}
            </nav>
            <p className="md:hidden text-xs font-semibold text-primary">
              {step + 1} de {STEPS.length} · {STEPS[step]}
            </p>
          </div>
          <a href={WA_URL} aria-label="Falar no WhatsApp" className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-2 text-xs text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
            <MessageCircle className="size-5 text-primary" /> <span className="hidden sm:inline">Pular para o WhatsApp</span>
          </a>
        </div>
      </header>

      <motion.main
        className="flex-1 mx-auto w-full max-w-6xl px-4 pt-6 pb-32 md:py-16 overflow-hidden"
        onPanEnd={(_, info) => {
          if (Math.abs(info.offset.x) < 70 || Math.abs(info.offset.y) > Math.abs(info.offset.x)) return;
          go(info.offset.x < 0 ? step + 1 : step - 1);
        }}
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -60, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onAnimationStart={() => window.scrollTo({ top: 0 })}
          >
            {step === 0 && <Step1 />}
            {step === 1 && <Step2 />}
            {step === 2 && <Step3 />}
            {step === 3 && <Step4 />}
            {step === 4 && <Step5 onRestart={() => go(0)} />}
          </motion.section>
        </AnimatePresence>
        <p className="mt-6 text-center text-xs text-muted-foreground md:hidden">Deslize para o lado para avançar</p>
        <p className="mt-4 text-center text-xs text-muted-foreground hidden md:block">Use as setas ← → do teclado para navegar</p>
      </motion.main>

      <div className="fixed md:static bottom-0 inset-x-0 z-20 glass border-x-0 border-b-0 md:border-0 md:bg-transparent md:backdrop-blur-none pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-6xl px-4 py-3 md:pb-12 flex items-center gap-3">
          <button onClick={() => go(step - 1)} disabled={step === 0} aria-label="Voltar" className="inline-flex items-center justify-center gap-2 rounded-xl glass h-14 px-5 font-medium disabled:opacity-30 hover:bg-secondary transition">
            <ArrowLeft className="size-5" /> <span className="hidden md:inline">Voltar</span>
          </button>
          {step < 4 ? (
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => go(step + 1)} className="flex-1 md:flex-none md:ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-14 px-6 text-base font-bold glow">
              <span className="md:hidden">Avançar</span><span className="hidden md:inline">{next[step]}</span> <ArrowRight className="size-5" />
            </motion.button>
          ) : (
            <a href={WA_URL} className="md:hidden flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-14 font-bold pulse-cta">
              <MessageCircle className="size-5" /> Chamar no WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">{children}</p>;
}

function Step1() {
  return (
    <div>
      <Kicker>Etapa 01 · O diagnóstico</Kicker>
      <h1 className="text-3xl sm:text-3xl sm:text-4xl md:text-6xl font-bold max-w-4xl leading-[1.05]">
        Quanto do seu suor você está <span className="text-destructive">doando para o iFood</span> todo mês?
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        Você trabalha pesado na cozinha, mas 20% a 25% do faturamento bruto fica retido em comissões abusivas — e o cliente nem é seu.
      </p>
      <div className="mt-10 grid md:grid-cols-2 gap-5">
        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-7 border-destructive/40">
          <p className="text-sm text-muted-foreground">Com Aplicativos Tradicionais</p>
          <p className="text-5xl font-display font-bold text-destructive mt-2">25%</p>
          <ul className="mt-5 space-y-3">
            {["Taxa sobre cada pedido", "Sem acesso aos dados do cliente", "Pagamento retido por semanas"].map((t) => (
              <li key={t} className="flex gap-2.5"><X className="size-5 text-destructive shrink-0" />{t}</li>
            ))}
          </ul>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-7 border-primary/50 glow">
          <p className="text-sm text-muted-foreground">Com sua Plataforma Própria</p>
          <p className="text-5xl font-display font-bold text-primary text-glow mt-2">0%</p>
          <ul className="mt-5 space-y-3">
            {["Zero comissão por pedido", "Dinheiro direto na sua conta via Pix", "Cliente 100% fiel à sua marca"].map((t) => (
              <li key={t} className="flex gap-2.5"><Check className="size-5 text-primary shrink-0" />{t}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

const MODULES = [
  { icon: Smartphone, name: "Cardápio Web do Cliente" },
  { icon: ChefHat, name: "Painel da Cozinha" },
  { icon: Bike, name: "App do Motoboy & Rastreio" },
];

function Step2() {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <Kicker>Etapa 02 · A engenharia</Kicker>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl">Uma infraestrutura completa de delivery próprio, conectada em tempo real.</h2>
      <div className="mt-6 grid grid-cols-3 gap-2 md:gap-3">
        {MODULES.map((m, i) => (
          <button key={m.name} onClick={() => setTab(i)} className={`rounded-xl p-4 text-left transition glass ${tab === i ? "border-primary glow" : "hover:bg-secondary"}`}>
            <m.icon className={`size-6 ${tab === i ? "text-primary" : "text-muted-foreground"}`} />
            <p className="mt-2 text-xs sm:text-sm md:text-base font-semibold leading-tight">{m.name}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mt-6 glass rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
          {tab === 0 && <MenuDemo />}
          {tab === 1 && <KitchenDemo />}
          {tab === 2 && <RiderDemo />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Feature({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <ul className="mt-4 space-y-3 text-muted-foreground">
        {items.map((t) => <li key={t} className="flex gap-2.5"><Check className="size-5 text-primary shrink-0" />{t}</li>)}
      </ul>
    </div>
  );
}

function MenuDemo() {
  const [cart, setCart] = useState(0);
  const items = [["Marmita Executiva", 24], ["Parmegiana", 32], ["Feijoada Completa", 29]] as const;
  return (
    <>
      <Feature title="Cardápio Web do Cliente" items={["Layout fluido com fotos e vídeos em alta", "Carrinho instantâneo, sem baixar app", "Checkout com Pix automático"]} />
      <div className="mx-auto w-60 rounded-[2rem] border-4 border-secondary bg-background p-4">
        <p className="text-xs text-muted-foreground">Seu Restaurante</p>
        <p className="font-display font-bold mb-3">Cardápio do dia</p>
        {items.map(([n, p]) => (
          <div key={n} className="flex items-center justify-between py-2 border-b last:border-0">
            <div><p className="text-sm">{n}</p><p className="text-xs text-primary">{brl(p)}</p></div>
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => setCart((c) => c + p)} className="size-7 rounded-full bg-primary text-primary-foreground font-bold">+</motion.button>
          </div>
        ))}
        <div className="mt-3 rounded-lg bg-primary text-primary-foreground py-2 text-center text-sm font-bold">Pagar com Pix · {brl(cart)}</div>
      </div>
    </>
  );
}

function KitchenDemo() {
  const cols = [["Recebido", ["#1042 Parmegiana", "#1043 Marmita"]], ["Em Preparo", ["#1040 Feijoada"]], ["Pronto", ["#1038 Executiva"]]] as const;
  return (
    <>
      <Feature title="Painel da Cozinha" items={["Comandas com status em tempo real", "Métricas de vendas do dia", "Controle de itens e estoque"]} />
      <div className="grid grid-cols-3 gap-2">
        {cols.map(([c, os], i) => (
          <div key={c} className="rounded-xl bg-secondary p-2">
            <p className={`text-xs font-bold mb-2 ${i === 2 ? "text-primary" : i === 1 ? "text-accent" : "text-muted-foreground"}`}>{c}</p>
            {os.map((o) => <div key={o} className="rounded-md bg-background p-2 text-xs mb-1.5">{o}</div>)}
          </div>
        ))}
      </div>
    </>
  );
}

function RiderDemo() {
  return (
    <>
      <Feature title="App do Motoboy & Rastreio" items={["Despacho direto para o entregador", "Frete calculado por KM automaticamente", "Cliente acompanha o motoboy no mapa ao vivo"]} />
      <div className="relative h-56 rounded-xl bg-secondary overflow-hidden" style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "28px 28px" }}>
        <MapPin className="absolute right-8 top-8 size-7 text-accent" />
        <motion.div className="absolute" animate={{ left: ["10%", "75%"], top: ["75%", "20%"] }} transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}>
          <div className="size-9 rounded-full bg-primary grid place-items-center glow"><Bike className="size-5 text-primary-foreground" /></div>
        </motion.div>
        <p className="absolute bottom-3 left-3 text-xs glass rounded-md px-2 py-1">Chega em 8 min · 2,4 km</p>
      </div>
    </>
  );
}

function Step3() {
  const [rev, setRev] = useState(30000);
  const fee = rev * 0.25;
  return (
    <div>
      <Kicker>Etapa 03 · Sua economia</Kicker>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl">Veja exatamente quanto dinheiro volta para o seu caixa.</h2>
      <div className="mt-8 glass rounded-2xl p-6 md:p-8">
        <div className="flex justify-between items-end">
          <label htmlFor="rev" className="text-muted-foreground">Quanto você fatura por mês no delivery?</label>
          <span className="font-display text-3xl font-bold">{brl(rev)}{rev >= 100000 ? "+" : ""}</span>
        </div>
        <input id="rev" type="range" min={10000} max={100000} step={1000} value={rev} onChange={(e) => setRev(+e.target.value)} className="mt-5 w-full accent-[var(--primary)] h-2" />
      </div>
      <div className="mt-5 grid md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Taxa doada hoje pro iFood/mês</p>
          <p className="mt-2 font-display text-4xl font-bold text-destructive">-{brl(fee)}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Custo com Sistema Próprio</p>
          <p className="mt-2 font-display text-xl font-bold">Apenas infraestrutura fixa + taxa padrão do Pix</p>
        </div>
        <div className="glass rounded-2xl p-6 border-primary/50 glow">
          <p className="text-sm text-muted-foreground">Seu lucro resgatado por ano</p>
          <motion.p key={rev} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="mt-2 font-display text-4xl font-bold text-primary text-glow">+{brl(fee * 12)}</motion.p>
        </div>
      </div>
      <p className="mt-6 text-lg text-accent font-semibold">Com essa economia, a implantação do sistema se paga já nos primeiros 30 dias.</p>
    </div>
  );
}

function Step4() {
  return (
    <div>
      <Kicker>Etapa 04 · O acelerador opcional</Kicker>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl">O sistema é 100% independente — mas também podemos acelerar seus pedidos.</h2>
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-7">
          <Megaphone className="size-7 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-bold">Opção 1 · Autônoma</h3>
          <p className="mt-2 text-muted-foreground">Você é livre para divulgar no seu Instagram, WhatsApp ou colocar a agência que preferir.</p>
        </div>
        <div className="glass rounded-2xl p-7 border-accent/50">
          <TrendingUp className="size-7 text-accent" />
          <h3 className="mt-4 text-xl font-bold">Opção 2 · Gestão de Tráfego Especializada</h3>
          <p className="mt-2 text-muted-foreground">Gerenciamos seus anúncios locais no Meta Ads. Criamos públicos semelhantes (Lookalike) a partir da sua base de clientes e anunciamos num raio de 5 a 8 km para lotar sua cozinha no almoço e jantar todos os dias.</p>
        </div>
      </div>
    </div>
  );
}

function Step5({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="text-center flex flex-col items-center">
      <Kicker>Etapa 05 · Demonstração</Kicker>
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold max-w-4xl">Pronto para ter sua operação rodando com tecnologia de ponta?</h2>
      <ul className="mt-8 space-y-3 text-left">
        {["Sistema 100% customizado com a sua marca e cores", "Sem mensalidades abusivas e zero comissão por prato vendido", "Implantação rápida e suporte direto de Desenvolvedor Full Stack"].map((t) => (
          <li key={t} className="flex gap-3 text-lg"><span className="size-6 rounded-full bg-primary grid place-items-center shrink-0"><Check className="size-4 text-primary-foreground" /></span>{t}</li>
        ))}
      </ul>
      <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href={WA_URL} className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-primary text-primary-foreground w-full sm:w-auto justify-center px-6 py-5 text-base md:text-xl font-bold pulse-cta">
        <MessageCircle className="size-7" /> SOLICITAR DEMONSTRAÇÃO NO WHATSAPP
      </motion.a>
      <button onClick={onRestart} className="mt-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <RotateCcw className="size-4" /> Rever a apresentação desde o início
      </button>
    </div>
  );
}
