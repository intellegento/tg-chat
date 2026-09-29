import { ChatProvider } from '../context/ChatContext';
import '../styles/global.scss';

export default function MyApp({ Component, pageProps }) {
  return (
    <ChatProvider>
      <Component {...pageProps} />
    </ChatProvider>
  );
}
