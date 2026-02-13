class ChatMessage {
  constructor({ id, matchId, senderId, message, createdAt }) {
    this.id = id;
    this.matchId = matchId;
    this.senderId = senderId;
    this.message = message;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = ChatMessage;
