import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { formatTime } from '../../lib/chatId';
import styles from './styles.module.scss';

export default function ChatWindow() {
  const { chats, activeId, send } = useChat();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const bottom = useRef(null);
  const chat = activeId && chats[activeId];

  useEffect(() => {
    bottom.current?.scrollIntoView();
  }, [chat?.messages.length, activeId]);

  if (!chat) return <main className={styles.empty}>Введите номер телефона и создайте чат</main>;

  const submit = async (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message) return;
    setText('');
    setError('');
    try {
      await send(message);
    } catch {
      setError('Не удалось отправить сообщение');
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>{chat.title}</header>
      <div className={styles.messages}>
        {chat.messages.map((m) => (
          <div key={m.id} className={`${styles.bubble} ${m.out ? styles.out : styles.in}`}>
            {m.text}
            <span className={styles.time}>{formatTime(m.ts)}</span>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.composer} onSubmit={submit}>
        <input placeholder="Сообщение" value={text} onChange={(e) => setText(e.target.value)} />
        <button>Отправить</button>
      </form>
    </main>
  );
}
