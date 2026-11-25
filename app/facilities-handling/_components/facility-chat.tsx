"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Headset, SendHorizontal, Trash2 } from "lucide-react";
import { firstName } from "@/components/auth/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import type { AuthUser } from "@/lib/auth-client/api";
import { TOPICS, topicById, type Topic } from "./facility-topics";
import { deskReply, type DeskReply } from "./desk-replies";

type Partner = AuthUser;
type Message = { id: string; from: "me" | "desk" | "note"; text: string; at: number; action?: DeskReply["action"] };

const WHATSAPP_NUMBER = "917688866933";
/** Per user and topic, so two people sharing a device never see each other's chats. */
const storageKey = (partner: Partner, topic: Topic) => `bw-chat:${partner.id}:${topic.id}`;
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const timeLabel = (at: number) => new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(at);
/** Saved chats come back from localStorage, so only allow link types the desk itself uses (never `javascript:`). */
const safeHref = (href: string) => /^(https:\/\/|tel:)/i.test(href);

function welcome(partner: Partner, topic: Topic): Message[] {
  return [{ id: newId(), from: "desk", at: Date.now(),
    text: `Namaste ${firstName(partner)}! You're in the ${topic.name} chat. I'm the dispatch desk assistant and can answer quick questions about the facility. To reach the team, tap "Send to team" and this chat opens in WhatsApp ready to send.` }];
}

function loadMessages(partner: Partner, topic: Topic): Message[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey(partner, topic)) ?? "null");
    if (Array.isArray(saved) && saved.length) return saved as Message[];
  } catch { /* ignore bad or blocked storage */ }
  return welcome(partner, topic);
}

/** Chat page: topic list on the side, conversation with the dispatch desk in the middle. */
export function FacilityChat({ topicId }: { topicId?: string }) {
  const topic = topicById(topicId);
  return <ProtectedRoute roles={["partner", "admin"]}>{(partner) => <div className="fh-shell fh-shell-chat">
    <div className="fh-chat-layout">
      <TopicList current={topic} />
      <Conversation key={topic.id} partner={partner} topic={topic} />
    </div>
  </div>}</ProtectedRoute>;
}

function TopicList({ current }: { current: Topic }) {
  const sideRef = useRef<HTMLElement>(null);
  // On phones the list is a sideways strip: slide the open topic into view (without scrolling the page).
  useEffect(() => {
    const side = sideRef.current;
    const active = side?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!side || !active || side.scrollWidth <= side.clientWidth) return;
    side.scrollTo({ left: active.offsetLeft - (side.clientWidth - active.offsetWidth) / 2, behavior: "smooth" });
  }, [current.id]);

  return <aside ref={sideRef} className="fh-side" aria-label="Chat topics">
        <Link className="fh-back" href="/facilities-handling"><ArrowLeft size={16} aria-hidden="true" /> Facilities Handling</Link>
        <p className="fh-side-label">Topics</p>
        <nav className="fh-topics">
          {TOPICS.map(({ id, name, short, icon: Icon }) => <Link key={id} href={`/facilities-handling/chat?topic=${id}`} replace scroll={false}
            className="fh-topic" aria-current={id === current.id ? "page" : undefined}>
            <span className="fh-topic-icon" aria-hidden="true"><Icon size={17} strokeWidth={1.8} /></span>
            <span className="fh-topic-text"><b>{name}</b><small>{short}</small></span>
          </Link>)}
        </nav>
      </aside>;
}

function Conversation({ partner, topic }: { partner: Partner; topic: Topic }) {
  const [messages, setMessages] = useState<Message[]>(() => loadMessages(partner, topic));
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  useEffect(() => {
    try { window.localStorage.setItem(storageKey(partner, topic), JSON.stringify(messages.slice(-200))); } catch { /* storage full or blocked */ }
  }, [messages, partner, topic]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const add = (message: Omit<Message, "id" | "at">) => setMessages((current) => [...current, { ...message, id: newId(), at: Date.now() }]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    add({ from: "me", text: clean });
    setDraft("");
    setTyping(true);
    const reply = deskReply(clean);
    timers.current.push(window.setTimeout(() => { setTyping(false); add({ from: "desk", text: reply.text, action: reply.action }); }, 650 + Math.min(clean.length * 12, 700)));
    inputRef.current?.focus();
  }

  function onSubmit(event: FormEvent) { event.preventDefault(); send(draft); }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(draft); }
  }

  function sendToTeam() {
    const mine = messages.filter((m) => m.from === "me").map((m) => `• ${m.text}`);
    const text = [
      `Hello, this is ${partner.name} (Service Partner).`,
      `Topic: ${topic.name}`,
      `Email: ${partner.email}`,
      "",
      ...(mine.length ? mine : ["I would like to discuss this requirement."]),
    ].join("\n");
    const win = window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    if (!win) { add({ from: "note", text: "Your browser blocked WhatsApp. Allow pop-ups for this site, or call 76888 66933." }); return; }
    win.opener = null;
    add({ from: "note", text: "Chat opened in WhatsApp — press Send there to reach the team." });
  }

  function clearChat() {
    timers.current.forEach((t) => window.clearTimeout(t));
    setTyping(false);
    setMessages(welcome(partner, topic));
  }

  const hasMine = messages.some((m) => m.from === "me");
  const TopicIcon = topic.icon;

  return <section className="fh-chat" aria-label={`${topic.name} chat`}>
    <header className="fh-chat-head">
      <span className="fh-avatar" aria-hidden="true"><Headset size={20} /><i /></span>
      <div className="fh-chat-title">
        <h1>Dispatch Desk</h1>
        <p><TopicIcon size={13} aria-hidden="true" /> {topic.name}</p>
      </div>
      <div className="fh-chat-tools">
        <button type="button" className="fh-icon-btn" onClick={clearChat} aria-label="Clear this chat" title="Clear this chat"><Trash2 size={17} /></button>
        <button type="button" className="fh-btn fh-btn-gold fh-btn-sm" onClick={sendToTeam}>Send to team <ArrowUpRight size={15} aria-hidden="true" /></button>
      </div>
    </header>

    <div className="fh-messages" ref={scrollRef} role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((m) => m.from === "note"
        ? <p key={m.id} className="fh-note"><Check size={13} aria-hidden="true" /> {m.text}</p>
        : <div key={m.id} className="fh-msg" data-from={m.from}>
          <div className="fh-bubble">
            <p>{m.text}</p>
            {m.action && safeHref(m.action.href) && <a className="fh-bubble-action" href={m.action.href} target={m.action.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{m.action.label} <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
          <time dateTime={new Date(m.at).toISOString()}>{m.from === "me" ? "You" : "Desk"} · {timeLabel(m.at)}</time>
        </div>)}
      {typing && <div className="fh-msg" data-from="desk"><div className="fh-bubble fh-typing" aria-label="Desk is typing"><span /><span /><span /></div></div>}
    </div>

    {!hasMine && <div className="fh-starters" aria-label="Suggested messages">
      {topic.starters.map((s) => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}
    </div>}

    <form className="fh-composer" onSubmit={onSubmit}>
      <label htmlFor="fh-input" className="fh-sr">Message</label>
      <textarea id="fh-input" ref={inputRef} rows={1} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown}
        placeholder="Type your message…" maxLength={1000} autoFocus />
      <button type="submit" className="fh-send" disabled={!draft.trim()} aria-label="Send message"><SendHorizontal size={19} /></button>
    </form>
  </section>;
}
