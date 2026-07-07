from openai import OpenAI
import os
from dotenv import load_dotenv
import json
from prompts.resume_parser_prompt import SYSTEM_PROMPT
from prompts.interview_question_prompt import QUESTION_GENERATION_PROMPT
from prompts.interview_evaluation_prompt import EVALUATION_PROMPT

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

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
                response_format={
                    "type": "json_object"
                },
                temperature=0,
                max_tokens=500
            )
            print(response)
            print("=" * 50)

            content = response.choices[0].message.content

            print("Content:", content)
            print("Type:", type(content))

            parsed_data = json.loads(content)
            
            # parsed_data = json.loads(response.choices[0].message.content)
            # print(parsed_data)
        except Exception as e:
            raise Exception(f"OpenRouter API Error: {e}")
        
        try:
            return parsed_data
        except json.JSONDecodeError:
            raise Exception("Failed to parse JSON from OpenRouter response.")
        
    @staticmethod
    def generate_questions(candidate_profile):
        try:
            response = client.chat.completions.create(
                model=os.getenv("OPENROUTER_MODEL"),
                messages=[
                    {
                        "role": "system",
                        "content": QUESTION_GENERATION_PROMPT
                    },
                    {
                        "role": "user",
                        "content": json.dumps(candidate_profile)
                    }
                ],
                response_format={
                    "type": "json_object"
                },
                temperature=0,
                max_tokens=500
            )
            content = response.choices[0].message.content
            # print("=" * 80)
            # print("RAW AI RESPONSE")
            # print(content)
            # print("=" * 80)

            # print("Finish Reason:", response.choices[0].finish_reason)
            # print("Message:", response.choices[0].message)
            # print("Content:", repr(response.choices[0].message.content))
            parsed_data = json.loads(content)
        except Exception as e:
            raise Exception(f"OpenRouter API Error: {e}")

        try:
            return parsed_data
        except json.JSONDecodeError:
            raise Exception("Failed to parse JSON from OpenRouter response.")
        
    @staticmethod
    def evaluate_answers(interview_data):

        if not interview_data:
            raise ValueError("Interview data cannot be empty.")

        try:
            response = client.chat.completions.create(
                model=os.getenv("OPENROUTER_MODEL"),
                messages=[
                    {
                        "role": "system",
                        "content": EVALUATION_PROMPT
                    },
                    {
                        "role": "user",
                        "content": json.dumps(
                            interview_data,
                            indent=2
                        )
                    }
                ],
                response_format={
                    "type": "json_object"
                },
                temperature=0,
                max_tokens=600
            )

            content = response.choices[0].message.content

            if not content:
                raise Exception("OpenRouter returned an empty response.")

            parsed_data = json.loads(content)

            return parsed_data

        except json.JSONDecodeError:
            raise Exception(
                "Failed to parse JSON from OpenRouter response."
            )

        except Exception as e:
            raise Exception(f"OpenRouter API Error: {e}")