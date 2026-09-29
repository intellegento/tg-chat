import { useState } from 'react';
import { getState } from '../../lib/api';
import { useChat } from '../../context/ChatContext';
import styles from './styles.module.scss';

export default function Login() {
  const { setCreds } = useChat();
  const [idInstance, setId] = useState('');
  const [apiTokenInstance, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const creds = { idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() };
    try {
      await getState(creds);
      setCreds(creds);
    } catch {
      setError('Не удалось войти. Проверьте idInstance и apiTokenInstance.');
      setLoading(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={submit}>
      <h1>Вход</h1>
      <p>Введите данные из личного кабинета GREEN-API</p>
      <input placeholder="idInstance" value={idInstance} onChange={(e) => setId(e.target.value)} required />
      <input
        type="password"
        placeholder="apiTokenInstance"
        value={apiTokenInstance}
        onChange={(e) => setToken(e.target.value)}
        required
      />
      {error && <div className={styles.error}>{error}</div>}
      <button disabled={loading}>{loading ? 'Проверка…' : 'Войти'}</button>
    </form>
  );
}
