import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { matchId } = useParams();

  return (
    <section className="card">
      <h2>Chat</h2>
      <p>Conversation for match {matchId}.</p>
    </section>
  );
}
