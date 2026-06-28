from openai import OpenAI
import os
from dotenv import load_dotenv
import json

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

SYSTEM_PROMPT = """
    You are an expert resume parser.

    Your task is to analyze the provided resume text and extract:

    - Skills
    - Projects
    - Education
    - Experience

    Return ONLY valid JSON.

    Do not include markdown.
    Do not include explanations.
    Do not wrap the response inside ```json.

    If a section is missing, return an empty array.

    JSON Structure:

    {
        "skills": [],
        "projects": [
            {
                "title": "",
                "description": "",
                "technologies": [],
                "role": ""
            }
        ],
        "education": [
            {
                "degree": "",
                "institution": "",
                "year": ""
            }
        ],
        "experience": [
            {
                "company": "",
                "role": "",
                "duration": "",
                "description": ""
            }
        ]
    }
    Your response must be parseable by Python's json.loads() without any preprocessing.
"""

class AIService:

    @staticmethod
    def parse_resume(text):
        if not text.strip():
            raise ValueError("Resume text cannot be empty.")
        try:
            response = client.chat.completions.create(
            model=os.getenv("OPENROUTER_MODEL"),
                messages=[
                        {
                            "role": "system",
                            "content": SYSTEM_PROMPT
                        },
                        {
                            "role": "user",
                            "content": text
                        }
                    ],
                temperature=0,
                max_tokens=500
            )
            parsed_data = json.loads(response.choices[0].message.content)
        except Exception as e:
            raise Exception(f"OpenRouter API Error: {e}")
        
        try:
            return parsed_data
        except json.JSONDecodeError:
            raise Exception("Failed to parse JSON from OpenRouter response.")