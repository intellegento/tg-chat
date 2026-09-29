# Telegram Chat (GREEN-API)

Веб-интерфейс для отправки и получения текстовых сообщений в Telegram через GREEN-API.
Стек: React, Next.js (webpack), SCSS modules.

## Запуск
```
nvm use
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Использование
1. Введите `idInstance` и `apiTokenInstance` из личного кабинета GREEN-API (инстанс Telegram должен быть авторизован).
2. Введите номер телефона получателя и нажмите «+».
3. Напишите сообщение и отправьте — ответы получателя появятся в чате.

## Методы GREEN-API
- `SendMessage` — отправка текста
- `ReceiveNotification` + `DeleteNotification` — получение сообщений (HTTP API)
- `GetStateInstance` — проверка данных при входе

## При возникновении внутри приложения проблем с приемом сообщений выполнить:
curl -X POST 'https://4100.api.green-api.com/waInstance410022751165/setSettings/56beb821b2d04931a59004127008df5b46a686dd84b84569a6' \
  -H 'Content-Type: application/json' \
  -d '{"webhookUrl":"","incomingWebhook":"yes"}'
## При возникновении внутри приложения проблем с приемом сообщений выполнить:
```
curl -X POST 'https://4100.api.green-api.com/waInstance410022751165/setSettings/56beb821b2d04931a59004127008df5b46a686dd84b84569a6' \
  -H 'Content-Type: application/json' \
  -d '{"webhookUrl":"","incomingWebhook":"yes"}'
```

## При возникновении внутри приложения проблем с приемом сообщений выполнить:
```
curl -X POST 'https://4100.api.green-api.com/waInstance410022751165/setSettings/56beb821b2d04931a59004127008df5b46a686dd84b84569a6' \
  -H 'Content-Type: application/json' \
  -d '{"webhookUrl":"","incomingWebhook":"yes"}'
```
