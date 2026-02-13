class Internship {
  constructor({ id, title, company, location, stipend, skills, description, recruiterId, createdAt }) {
    this.id = id;
    this.title = title;
    this.company = company;
    this.location = location;
    this.stipend = stipend || "";
    this.skills = skills || [];
    this.description = description || "";
    this.recruiterId = recruiterId;
    this.createdAt = createdAt || new Date().toISOString();
  }

  static toDocument(internship) {
    return {
      title: internship.title,
      company: internship.company,
      location: internship.location,
      stipend: internship.stipend,
      skills: internship.skills,
      description: internship.description,
      recruiterId: internship.recruiterId,
      createdAt: internship.createdAt
    };
  }
}

module.exports = Internship;
