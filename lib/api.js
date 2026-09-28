import { API_URL, RECEIVE_TIMEOUT } from '../conf';

const url = (c, method) => `${API_URL}/waInstance${c.idInstance}/${method}/${c.apiTokenInstance}`;

async function request(u, options) {
  const res = await fetch(u, options);
  if (!res.ok) {
    const err = new Error(`Ошибка ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

const post = (u, body) =>
  request(u, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

// GetStateInstance — проверка учётных данных при входе
export const getState = (c) => request(url(c, 'getStateInstance'));

// CheckAccount — получение chatId Telegram по номеру телефона
export const checkAccount = (c, phoneNumber) =>
  post(url(c, 'checkAccount'), { phoneNumber: Number(phoneNumber) });

// SendMessage
export const sendMessage = (c, chatId, message) => post(url(c, 'sendMessage'), { chatId, message });

// ReceiveNotification (HTTP API)
export const receiveNotification = (c) =>
  request(`${url(c, 'receiveNotification')}?receiveTimeout=${RECEIVE_TIMEOUT}`);

// DeleteNotification
export const deleteNotification = (c, receiptId) =>
  request(`${url(c, 'deleteNotification')}/${receiptId}`, { method: 'DELETE' });
