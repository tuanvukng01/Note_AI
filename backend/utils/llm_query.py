import openai
from backend.config import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

def ask_question(context: str, question: str, max_tokens: int = 150, temperature: float = 0.7) -> str:
    prompt = f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"
    response = openai.Completion.create(
        engine="text-davinci-003",  # Alternatively, adjust to your preferred engine
        prompt=prompt,
        max_tokens=max_tokens,
        temperature=temperature,
        n=1,
        stop=None,
    )
    answer = response.choices[0].text.strip()
    return answer