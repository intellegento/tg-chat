import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { checkAccount, sendMessage } from '../lib/api';
import { normalizeId } from '../lib/chatId';
import useNotifications from '../hooks/useNotifications';

const STORAGE_KEY = 'tg-chat';

const ChatContext = createContext(null);
export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [creds, setCreds] = useState(null);
  const [chats, setChats] = useState({}); // { key: { chatId, title, messages } }
  const [activeId, setActiveId] = useState(null);

  // Восстановление сессии после обновления страницы
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        setCreds(saved.creds || null);
        setChats(saved.chats || {});
        setActiveId(saved.activeId || null);
      }
    } catch {}
    setReady(true);
  }, []);

  // Сохранение сессии, чатов и переписки
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ creds, chats, activeId }));
    } catch {}
  }, [ready, creds, chats, activeId]);

  const addMessage = useCallback((chatId, title, msg) => {
    const key = normalizeId(chatId);
    setChats((prev) => {
      const chat = prev[key] || { chatId, title: title || key, messages: [] };
      if (chat.messages.some((m) => m.id === msg.id)) return prev;
      const newTitle = chat.title === key && title ? title : chat.title;
      return { ...prev, [key]: { ...chat, title: newTitle, messages: [...chat.messages, msg] } };
    });
  }, []);

  useNotifications(creds, (m) =>
    addMessage(m.chatId, m.title, { id: m.id, text: m.text, out: false, ts: m.ts }),
  );

  // Номер телефона -> chatId (CheckAccount) -> новый чат
  const createChat = useCallback(
    async (phone) => {
      const digits = phone.replace(/\D/g, '');
      if (!digits) throw new Error('Введите номер в международном формате');
      const { chatId } = await checkAccount(creds, digits);
      if (!chatId) throw new Error('Аккаунт Telegram с таким номером не найден');
      const key = normalizeId(chatId);
      setChats((prev) =>
        prev[key] ? prev : { ...prev, [key]: { chatId, title: `+${digits}`, messages: [] } },
      );
      setActiveId(key);
    },
    [creds],
  );

  const send = useCallback(
    async (text) => {
      const chat = chats[activeId];
      const { idMessage } = await sendMessage(creds, chat.chatId, text);
      addMessage(chat.chatId, null, { id: idMessage, text, out: true, ts: Date.now() });
    },
    [chats, activeId, creds, addMessage],
  );

  const value = useMemo(
    () => ({ ready, creds, setCreds, chats, activeId, setActiveId, createChat, send }),
    [ready, creds, chats, activeId, createChat, send],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
