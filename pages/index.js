import Head from 'next/head';
import { useChat } from '../context/ChatContext';
import Login from '../components/Login';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import styles from '../styles/home.module.scss';

export default function Home() {
  const { ready, creds } = useChat();

  return (
    <>
      <Head>
        <title>Telegram Chat · GREEN-API</title>
      </Head>
      {!ready ? null : creds ? (
        <div className={styles.chat}>
          <Sidebar />
          <ChatWindow />
        </div>
      ) : (
        <div className={styles.login}>
          <Login />
        </div>
      )}
    </>
  );
}
