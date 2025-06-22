import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

import sys
import os
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from langdetect import detect
import requests
import json
import warnings

warnings.filterwarnings("ignore")

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

    lang_code = detect(question)
    language_map = {
        'ko': 'Korean',
        'ja': 'Japanese',
        'zh': 'Chinese',
        'en': 'English',
        # 필요시 추가
    }

    lang_name = language_map.get(lang_code, 'English') 

    # ✅ 프롬프트 구성
    context = "\n\n".join(retrieved_chunks)
    prompt = f"""
You are a helpful assistant. Please answer the following question in **{lang_name}**.
If you cannot write in {lang_name}, answer in English instead.


문서 내용:
{context}

질문:
{question}
"""

    # ✅ Ollama API 주소를 환경변수에서 가져오기 (기본값: http://localhost:11434)
    OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434")

    # ✅ Ollama API 호출
    response = requests.post(
        f"{OLLAMA_API_URL}/api/generate",
        json={
            "model": "llama3.1:8b",
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
