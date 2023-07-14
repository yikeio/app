## 认证方式

您需要在请求头中添加 `Authorization` 字段，值为 `Bearer [token]`，其中 `[token]` 为您的 [token](/developers?tab=tokens)。

```http
Authorization: Bearer [token]
```

## API

### 获取用户信息

```http
GET /api/user
```

#### 返回值

```json
{
  "id": "8230038xxxxxxx",
  "root_referrer_id": "8171858xxxxxxxxx",
  "referrer_id": "8171858xxxxxxxxx",
  "level": 1,
  "referrer_path": "8171858xxxxxxxxx",
  "referral_code": "ZHRG38",
  "referrals_count": 0,
  "name": "OVERTRUE",
  "phone_number": "+86:xxxxxxxxxxx",
  "email": null,
  "is_admin": false,
  "created_at": "2023-04-26T09:03:14.000000Z",
  "updated_at": "2023-07-03T03:26:15.000000Z",
  "first_active_at": "2023-04-26T09:03:14.000000Z",
  "last_active_at": "2023-07-07T06:45:23.000000Z",
  "deleted_at": null,
  "state": "activated",
  "paid_total": "0.00",
  "avatar": "/avatars/memoji/8.png",
  "has_paid": false,
  "referral_url": "https://yike.io/?referrer=xxxxxx",
  "rewards_total": 0,
  "unwithdrawn_rewards_total": 0,
  "referrer": null
}
```

### 获取场景列表

```http
GET /api/prompts?page=N
```

#### 返回值

```json
{
  "current_page": 1,
  "data": [
    {
      "id": "17523109896650752",
      "creator_id": 0,
      "name": "历史学家",
      "description": "使用史实资料分析历史主题。",
      "logo": null,
      "greeting": "嗨，欢迎来到一刻，你想聊点什么？",
      "prompt_cn": "我希望你能作为一名历史学家行事。你将研究和分析过去的文化、经济、政治和社会事件，从原始资料中收集数据，并利用它来发展关于各个历史时期发生的理论。",
      "prompt_en": "I want you to act as a historian. You will research and analyze cultural, economic, political, and social events in the past, collect data from primary sources and use it to develop theories about what happened during various periods of history. My first suggestion request is ",
      "settings": null,
      "sort_order": 256,
      "created_at": "2023-05-22T00:30:34.000000Z",
      "updated_at": "2023-05-22T00:30:34.000000Z",
      "deleted_at": null,
      "conversations_count": 0
    }
  ],
  "from": 1,
  "per_page": 100,
  "prev_page_url": null,
  "to": 100
}
```

### 创建对话

```http
POST /api/chat/conversations

```json
{
  "title": "新的对话",
  "prompt_id": "0", // 可选，如果不指定场景，将使用默认场景
}
```

### 获取对话历史

```http
GET /api/conversations?page=N
```

#### 返回值

```json
{
  "current_page": 1,
  "data": [
    {
      "id": "22986029669548032",
      "title": "新对话",
      "prompt_id": "0",
      "messages_count": 0,
      "tokens_count": 0,
      "created_at": "2023-06-06T02:18:16.000000Z",
      "updated_at": "2023-06-06T02:18:16.000000Z",
      "deleted_at": null,
      "first_active_at": null,
      "last_active_at": null,
      "prompt": null
    }
  ],
  "from": 1,
  "last_page": 3,
  "per_page": 15,
  "prev_page_url": null,
  "to": 15,
  "total": 42
}
```

### 获取对话详情

```http
GET /api/chat/conversations/:id
```

#### 返回值

```json
{
  "title": "新的对话",
  "prompt_id": "0",
  "id": "34286151409860608",
  "updated_at": "2023-07-07T06:40:55.000000Z",
  "created_at": "2023-07-07T06:40:55.000000Z"
}
```

### 获取指定对话的消息列表

```http
GET /api/chat/conversations/:id/messages?page=N
```

#### 返回值

```json
{
  "current_page": 1,
  "data": [
    {
      "id": "33172875728912384",
      "conversation_id": "33172875707940864",
      "role": "assistant",
      "content": "嗨，欢迎来到一刻，你想聊点什么？",
      "tokens_count": 0,
      "created_at": "2023-07-04T04:57:09.000000Z",
      "updated_at": "2023-07-04T04:57:09.000000Z",
      "deleted_at": null,
      "quota_id": "0",
      "has_liked": false
    }
  ],
  "from": 1,
  "last_page": 1,
  "per_page": 15,
  "to": 5,
  "total": 5
}
```

### 发布消息

```http
POST /api/chat/conversations/:id/messages
```

#### 请求体

```json
// application/json
{
  "content": "请问你是谁？",
}
```

### 获取对话回复

```json
POST chat/conversations/:id/completions
```

该接口将流式返回对话回复，直到对话结束。响应内容为文本，`Content-Type` 为 `text/plain`。

#### 返回值

```text
嗨，欢迎来到一刻，你想聊点什么？
```
