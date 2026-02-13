class Match {
  constructor({ id, studentId, studentName, studentEmail, studentSkills, internshipId, internshipTitle, company, recruiterId, status, score, createdAt }) {
    this.id = id;
    this.studentId = studentId;
    this.studentName = studentName;
    this.studentEmail = studentEmail;
    this.studentSkills = studentSkills || [];
    this.internshipId = internshipId;
    this.internshipTitle = internshipTitle;
    this.company = company;
    this.recruiterId = recruiterId;
    this.status = status || "pending"; // pending, accepted, rejected
    this.score = score;
    this.createdAt = createdAt || new Date().toISOString();
  }

  static toDocument(match) {
    return {
      studentId: match.studentId,
      studentName: match.studentName,
      studentEmail: match.studentEmail,
      studentSkills: match.studentSkills,
      internshipId: match.internshipId,
      internshipTitle: match.internshipTitle,
      company: match.company,
      recruiterId: match.recruiterId,
      status: match.status,
      score: match.score,
      createdAt: match.createdAt
    };
  }
}

module.exports = Match;
