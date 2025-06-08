import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

import sys
import os
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import requests
import json

load_dotenv()

try:
    # ✅ 입력 질문 받기
    question = sys.argv[1]

    # ✅ Pinecone 연결
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index = pc.Index("chatbot")

    # ✅ 임베딩 모델 로드
    model = SentenceTransformer("intfloat/multilingual-e5-small")

    # ✅ 질문 임베딩 (접두어 'query:' 추가)
    query_embedding = model.encode("query: " + question, normalize_embeddings=True).tolist()

    # ✅ Pinecone 검색
    results = index.query(vector=query_embedding, top_k=3, include_metadata=True)
    retrieved_chunks = [match['metadata']['text'] for match in results['matches']]

    # ✅ 프롬프트 구성
    context = "\n\n".join(retrieved_chunks)
    prompt = f"""
아래 질문에 대해, 질문한 언어로 대답할 수 있으면 해당 언어로 답변하고,
그렇지 않으면 영어로 답변하세요.
답변은 간결하게, 필요한 내용만 빠르게 작성해 주세요.

문서 내용:
{context}

질문:
{question}
"""

    # ✅ Ollama API 호출
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )
    answer = response.json()["response"]

    # ✅ 결과 출력 (JSON)
    result = {"answer": answer}
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": f"서버 오류: {str(e)}"}))
    sys.exit(1)
