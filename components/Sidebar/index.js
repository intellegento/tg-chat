import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import styles from './styles.module.scss';

export default function Sidebar() {
  const { chats, activeId, setActiveId, createChat } = useChat();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createChat(phone);
      setPhone('');
    } catch (err) {
      setError(err.status === 466 ? 'Превышен лимит тарифа' : err.message || 'Не удалось создать чат');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <form className={styles.newChat} onSubmit={submit}>
        <input
          placeholder="Номер телефона получателя"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button title="Создать чат" disabled={loading}>+</button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.list}>
        {Object.entries(chats).map(([key, chat]) => (
          <div
            key={key}
            className={`${styles.item} ${key === activeId ? styles.active : ''}`}
            onClick={() => setActiveId(key)}
          >
            <div className={styles.avatar}>{chat.title[0]?.toUpperCase()}</div>
            <div className={styles.info}>
              <div className={styles.name}>{chat.title}</div>
              <div className={styles.last}>{chat.messages.at(-1)?.text || 'Нет сообщений'}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
