from models.interview_answers import InterviewAnswer
from models.resume import Resume
from models.skill import Skill
from models.project import Project
from models.experience import Experience
from models.interview import Interview
from models.interview_question import InterviewQuestion
from extensions import db
from .ai_services import AIService


class InterviewService:

    @staticmethod
    def build_candidate_profile(
        resume_id,
        role,
        difficulty
    ):
        resume = Resume.query.get(resume_id)

        if not resume:
            raise ValueError("Resume not found.")

        skills = Skill.query.filter_by(
            user_id=resume.user_id
        ).all()

        projects = Project.query.filter_by(
            user_id=resume.user_id
        ).all()

        experiences = Experience.query.filter_by(
            user_id=resume.user_id
        ).all()

        candidate_profile = {
            "role": role,
            "difficulty": difficulty,
            "skills": [
                skill.skill_name
                for skill in skills
            ],
            "projects": [
                {
                    "title": project.title,
                    "description": project.description,
                    "role": project.role
                }
                for project in projects
            ],
            "experience": [
                {
                    "company": exp.company,
                    "role": exp.role,
                    "duration": exp.duration,
                    "description": exp.description
                }
                for exp in experiences
            ]
        }

        return candidate_profile

    @staticmethod
    def create_interview(
        user_id,
        resume_id,
        role,
        difficulty
    ):
        interview = Interview(
            user_id=user_id,
            resume_id=resume_id,
            role=role,
            difficulty=difficulty,
            status="pending"
        )

        db.session.add(interview)

        # Generates interview.id without committing
        db.session.flush()

        return interview
    
    @staticmethod
    def save_questions(interview_id, questions):

        for index, question_data in enumerate(questions, start=1):

            question = InterviewQuestion(
                interview_id=interview_id,
                question=question_data.get("question"),
                topic=question_data.get("topic", "General"),
                difficulty=question_data.get("difficulty"),
                question_order=index
            )

            db.session.add(question)

    @staticmethod
    def start_interview(user_id,
        resume_id,
        role,
        difficulty
    ):
        try:
            candidate_profile = InterviewService.build_candidate_profile(
                resume_id,
                role,
                difficulty
            )
            questions = AIService.generate_questions(candidate_profile)
            interview = InterviewService.create_interview(
                user_id,
                resume_id,
                role,
                difficulty
            )
            InterviewService.save_questions(interview.id, questions.get("questions", []))
            db.session.commit()
            return {
                "interview": interview,
                "questions": questions
            }
        except Exception as e:
            db.session.rollback()
            raise 

    @staticmethod
    def evaluate_interview(interview_id):

        interview = Interview.query.get(interview_id)

        if not interview:
            raise ValueError("Interview not found.")

        questions = InterviewQuestion.query.filter_by(
            interview_id=interview.id
        ).order_by(
            InterviewQuestion.question_order
        ).all()

        interview_data = {
            "role": interview.role,
            "difficulty": interview.difficulty,
            "questions": []
        }

        answer_map = {}

        for question in questions:

            if not question.answers:
                continue

            answer = question.answers[0]

            answer_map[question.question_order] = answer

            interview_data["questions"].append(
                {
                    "question_number": question.question_order,
                    "question": question.question,
                    "answer": answer.answer_text
                }
            )

        evaluation = AIService.evaluate_answers(
            interview_data
        )

        for result in evaluation.get("answers", []):

            answer = answer_map.get(
                result["question_number"]
            )

            if answer:

                answer.score = result.get(
                    "score",
                    0
                )

                answer.feedback = result.get(
                    "feedback",
                    ""
                )

        interview.overall_score = evaluation.get(
            "overall_score",
            0
        )

        interview.status = "completed"

        db.session.commit()

        return evaluation
    
    @staticmethod
    def save_answers(answers):

        for answer_data in answers:

            interview_answer = InterviewAnswer(

                interview_question_id=answer_data["question_id"],

                answer_text=answer_data["answer"]

            )

            db.session.add(interview_answer)
    
    @staticmethod
    def get_interview_details(interview_id):

        interview = Interview.query.get(interview_id)

        if not interview:
            raise ValueError("Interview not found.")

        questions = InterviewQuestion.query.filter_by(
            interview_id=interview.id
        ).order_by(
            InterviewQuestion.question_order
        ).all()

        question_list = []

        for question in questions:

            answer = question.answers[0] if question.answers else None

            question_list.append({
                "id": question.id,
                "question": question.question,
                "topic": question.topic,
                "difficulty": question.difficulty,
                "question_order": question.question_order,
                "answer": answer.answer_text if answer else None,
                "score": answer.score if answer else None,
                "feedback": answer.feedback if answer else None
            })

        return {
            "id": interview.id,
            "role": interview.role,
            "difficulty": interview.difficulty,
            "status": interview.status,
            "overall_score": interview.overall_score,
            "created_at": interview.created_at.isoformat(),
            "questions": question_list
        }
    
    @staticmethod
    def get_interview_history(user_id):

        interviews = Interview.query.filter_by(
            user_id=user_id
        ).order_by(
            Interview.created_at.desc()
        ).all()

        history = []

        for interview in interviews:

            history.append({

                "id": interview.id,

                "role": interview.role,

                "difficulty": interview.difficulty,

                "status": interview.status,

                "overall_score": interview.overall_score,

                "created_at": interview.created_at.isoformat()

            })

        return history