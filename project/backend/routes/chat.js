const express = require("express");
const { randomUUID } = require("crypto");
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

// AI Agent knowledge base for InternSwipe
const knowledgeBase = {
  general: {
    about: "InternSwipe is an AI-powered internship matching platform that connects students with recruiters through a swipe-based interface.",
    features: "Our platform offers smart matching, profile management, real-time chat, and AI-powered recommendations for both students and recruiters."
  },
  student: {
    howToSwipe: "Go to 'Start Swiping' from your dashboard. You'll see internship cards - swipe right or click 'Like' to show interest, or swipe left/click 'Reject' to pass. Use the Prev/Next buttons to browse without deciding.",
    updateProfile: "Click 'Update Profile' on your dashboard. Fill in your education, skills, bio, and links. A complete profile gets better matches!",
    filters: "On the swipe page, use the filter panel on the right to filter by location, minimum match percentage, and required skills.",
    matches: "When a recruiter likes you back, it's a match! You'll see your matches in the Matches page where you can start chatting.",
    tips: "Complete your profile fully, add relevant skills, and write a compelling bio. This helps our AI match you with the best opportunities."
  },
  recruiter: {
    createCards: "Click 'Create Swipe Card' on your dashboard. Fill in the job title, company, location, stipend, required skills, and description.",
    viewCandidates: "Go to 'Browse Candidates' to see student profiles. Click 'Approve' to accept promising candidates.",
    acceptedStudents: "Your accepted students appear in the 'Accepted Students' panel. From there you can message them, revoke acceptance, or remove them.",
    matchPanel: "The 'Matches' page shows AI-matched candidates based on skill overlap between your internship requirements and student profiles.",
    tips: "Write clear job descriptions with specific skills. Our AI matches students based on skill overlap, so be precise about requirements."
  }
};

// AI response generator
function generateAIResponse(message, userRole) {
  const lowerMsg = message.toLowerCase();
  
  // Greeting responses
  if (lowerMsg.match(/^(hi|hello|hey|good morning|good evening)/)) {
    const greetings = [
      `Hello! I'm the InternSwipe AI assistant. How can I help you today?`,
      `Hi there! I'm here to help you navigate InternSwipe. What would you like to know?`,
      `Hey! Welcome to InternSwipe. Ask me anything about the platform!`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // About the platform
  if (lowerMsg.match(/what is|about|tell me about|explain/i) && lowerMsg.match(/internswipe|platform|app|this/i)) {
    return knowledgeBase.general.about + " " + knowledgeBase.general.features;
  }

  // Student-specific questions
  if (userRole === "student") {
    if (lowerMsg.match(/swipe|swiping|how to swipe|browse|find internship/i)) {
      return knowledgeBase.student.howToSwipe;
    }
    if (lowerMsg.match(/profile|update profile|edit profile|my profile/i)) {
      return knowledgeBase.student.updateProfile;
    }
    if (lowerMsg.match(/filter|search|sort|find specific/i)) {
      return knowledgeBase.student.filters;
    }
    if (lowerMsg.match(/match|matched|connection/i)) {
      return knowledgeBase.student.matches;
    }
    if (lowerMsg.match(/tip|advice|help me|improve|better/i)) {
      return knowledgeBase.student.tips;
    }
  }

  // Recruiter-specific questions
  if (userRole === "recruiter") {
    if (lowerMsg.match(/create|new card|post|add internship|swipe card/i)) {
      return knowledgeBase.recruiter.createCards;
    }
    if (lowerMsg.match(/candidate|student|browse|view/i) && !lowerMsg.match(/accepted/i)) {
      return knowledgeBase.recruiter.viewCandidates;
    }
    if (lowerMsg.match(/accepted|approved|hired/i)) {
      return knowledgeBase.recruiter.acceptedStudents;
    }
    if (lowerMsg.match(/match|matching|ai match/i)) {
      return knowledgeBase.recruiter.matchPanel;
    }
    if (lowerMsg.match(/tip|advice|help me|improve|better/i)) {
      return knowledgeBase.recruiter.tips;
    }
  }

  // Common questions for both roles
  if (lowerMsg.match(/how does|how do|explain how/i)) {
    if (userRole === "student") {
      return "Here's how InternSwipe works for students: 1) Complete your profile with skills and education. 2) Browse internships by swiping. 3) Get matched when recruiters like you back. 4) Chat with recruiters and land your dream internship!";
    } else {
      return "Here's how InternSwipe works for recruiters: 1) Create swipe cards for your internship positions. 2) Browse and approve promising candidates. 3) View AI-matched students in your Matches panel. 4) Connect with accepted students via chat!";
    }
  }

  if (lowerMsg.match(/contact|support|help|issue|problem/i)) {
    return "For technical support, please email support@internswipe.com. For urgent issues, you can also reach out through our social media channels. Is there anything specific I can help you troubleshoot?";
  }

  if (lowerMsg.match(/thank|thanks/i)) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  if (lowerMsg.match(/bye|goodbye|see you/i)) {
    return "Goodbye! Good luck with your " + (userRole === "student" ? "internship search" : "recruiting") + "! Feel free to chat anytime.";
  }

  // Default response with role-specific suggestions
  const suggestions = userRole === "student" 
    ? "You can ask me about:\n• How to swipe on internships\n• Updating your profile\n• Using filters to find specific roles\n• Tips for better matches\n• Understanding the matching system"
    : "You can ask me about:\n• Creating swipe cards for internships\n• Browsing and approving candidates\n• Viewing accepted students\n• Understanding AI matches\n• Tips for finding great candidates";

  return `I'm not sure I understand that question. ${suggestions}`;
}

// Chat history storage (in-memory for demo)
let chatHistories = {};
let matchChats = {};

const ensureConversation = (matchId) => {
  if (!matchChats[matchId]) {
    matchChats[matchId] = {
      matchId,
      messages: [],
      startedAt: new Date().toISOString()
    };
  }
  return matchChats[matchId];
};

const nextId = () => {
  try {
    return randomUUID();
  } catch (err) {
    return Date.now().toString(36);
  }
};

// Get chat history
router.get("/ai/history/:userId", (req, res) => {
  const { userId } = req.params;
  const history = chatHistories[userId] || [];
  res.json({ history });
});

// Send message to AI agent
router.post("/ai/message", (req, res) => {
  const { userId, message, userRole } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Initialize chat history for user if not exists
  if (!chatHistories[userId]) {
    chatHistories[userId] = [];
  }

  // Add user message to history
  const userMessage = {
    id: Date.now().toString(),
    sender: "user",
    text: message,
    timestamp: new Date().toISOString()
  };
  chatHistories[userId].push(userMessage);

  // Generate AI response
  const aiResponseText = generateAIResponse(message, userRole || "student");
  const aiMessage = {
    id: (Date.now() + 1).toString(),
    sender: "ai",
    text: aiResponseText,
    timestamp: new Date().toISOString()
  };
  chatHistories[userId].push(aiMessage);

  res.json({ 
    response: aiMessage,
    history: chatHistories[userId]
  });
});

// Clear chat history
router.delete("/ai/history/:userId", (req, res) => {
  const { userId } = req.params;
  chatHistories[userId] = [];
  res.json({ success: true });
});

// Student ↔ recruiter conversations
router.get("/match/:matchId", (req, res) => {
  const { matchId } = req.params;
  const conversation = ensureConversation(matchId);
  res.json({ matchId, messages: conversation.messages });
});

router.post("/match/:matchId/message", (req, res) => {
  const { matchId } = req.params;
  const { senderId, senderName, senderRole, message } = req.body;

  if (!senderId || !senderRole || !message) {
    return res.status(400).json({ error: "senderId, senderRole, and message are required" });
  }

  const conversation = ensureConversation(matchId);
  const chatMessage = new ChatMessage({
    id: nextId(),
    matchId,
    senderId,
    senderName: senderName || "Unknown",
    senderRole,
    message,
    createdAt: new Date().toISOString()
  });

  conversation.messages.push(chatMessage);
  res.status(201).json({ message: chatMessage, messages: conversation.messages });
});

router.post("/match/:matchId/start", (req, res) => {
  const { matchId } = req.params;
  const { senderId, senderName, senderRole, message } = req.body;

  if (!senderId || !senderRole) {
    return res.status(400).json({ error: "senderId and senderRole are required" });
  }

  const conversation = ensureConversation(matchId);
  if (conversation.messages.length > 0) {
    return res.json({ matchId, messages: conversation.messages });
  }

  const starterText = message && message.trim() !== ""
    ? message
    : "Hi there! Thanks for matching—looking forward to chatting.";

  const chatMessage = new ChatMessage({
    id: nextId(),
    matchId,
    senderId,
    senderName: senderName || "Unknown",
    senderRole,
    message: starterText,
    createdAt: new Date().toISOString()
  });

  conversation.messages.push(chatMessage);
  res.status(201).json({ message: chatMessage, messages: conversation.messages });
});

module.exports = router;
