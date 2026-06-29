from services.pdf_service import PDFService
from services.ai_services import AIService

from models.resume import Resume
from models.skill import Skill
from models.project import Project
from models.education import Education
from models.experience import Experience
from models.projectTechnology import ProjectTechnology

from extensions import db


class ResumeParserService:

    @staticmethod
    def process_resume(user_id, resume_id, filepath):

        # Extract text from PDF
        resume_text = PDFService.extract_text(filepath)

        if not resume_text.strip():
            raise ValueError("Resume contains no readable text.")

        # Parse using AI
        parsed_data = AIService.parse_resume(resume_text)

        if parsed_data is None:
            raise ValueError("Failed to parse resume using AI.")

        try:
            # Save parsed data
            ResumeParserService.save_skills(
                user_id,
                parsed_data.get("skills", [])
            )

            ResumeParserService.save_projects(
                user_id,
                parsed_data.get("projects", [])
            )

            ResumeParserService.save_education(
                user_id,
                parsed_data.get("education", [])
            )

            ResumeParserService.save_experience(
                user_id,
                parsed_data.get("experience", [])
            )

            # Mark resume as parsed
            resume = db.session.get(Resume, resume_id)

            if resume:
                resume.is_parsed = True

            # Commit everything once
            db.session.commit()

            return parsed_data

        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def save_skills(user_id, skills):

        for skill_name in skills:

            skill = Skill(
                user_id=user_id,
                skill_name=skill_name
            )

            db.session.add(skill)

    @staticmethod
    def save_projects(user_id, projects):
        for project_data in projects:
            project = Project(
                user_id=user_id,
                title=project_data["title"],
                description=project_data.get("description"),
                role=project_data.get("role")
            )

            db.session.add(project)
            db.session.flush()

            for tech in project_data.get("technologies", []):
                technology = ProjectTechnology(
                    project_id=project.id,
                    technology=tech
                )

                db.session.add(technology)

    @staticmethod
    def save_education(user_id, educations):
        for education_data in educations:
            education = Education(
                user_id=user_id,
                degree=education_data.get("degree"),
                institution=education_data.get("institution"),
                year=education_data.get("year")
            )

        db.session.add(education)

    @staticmethod
    def save_experience(user_id, experiences):
        for experience_data in experiences:

            experience = Experience(
                user_id=user_id,
                company=experience_data.get("company"),
                role=experience_data.get("role"),
                duration=experience_data.get("duration"),
                description=experience_data.get("description")
            )

        db.session.add(experience)