import { useEffect, useRef } from 'react';
import { receiveNotification, deleteNotification } from '../lib/api';
import { RETRY_DELAY } from '../conf';

// Получение входящих текстовых сообщений: ReceiveNotification -> DeleteNotification
export default function useNotifications(creds, onMessage) {
  const handler = useRef(onMessage);
  handler.current = onMessage;

  useEffect(() => {
    if (!creds) return undefined;
    let stopped = false;

    (async () => {
      while (!stopped) {
        try {
          const data = await receiveNotification(creds);
          if (data && data.body) {
            const b = data.body;
            if (
              b.typeWebhook === 'incomingMessageReceived' &&
              b.messageData?.typeMessage === 'textMessage'
            ) {
              handler.current({
                chatId: b.senderData.chatId,
                title: b.senderData.senderName || b.senderData.chatName,
                id: b.idMessage,
                text: b.messageData.textMessageData.textMessage,
                ts: b.timestamp * 1000,
              });
            }
            await deleteNotification(creds, data.receiptId);
          }
        } catch {
          await new Promise((r) => setTimeout(r, RETRY_DELAY));
        }
      }
    })();

    return () => {
      stopped = true;
    };
  }, [creds]);
}
