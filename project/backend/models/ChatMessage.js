class ChatMessage {
  constructor({ id, matchId, senderId, senderName, senderRole, message, createdAt }) {
    this.id = id;
    this.matchId = matchId;
    this.senderId = senderId;
    this.senderName = senderName || "";
    this.senderRole = senderRole || "";
    this.message = message;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = ChatMessage;
