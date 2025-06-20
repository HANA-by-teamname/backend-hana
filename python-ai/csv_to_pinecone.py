import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

import pandas as pd
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from tqdm import tqdm
from dotenv import load_dotenv

load_dotenv()

# ✅ Pinecone 설정
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("chatbot")

# ✅ 임베딩 모델 로드
model = SentenceTransformer("intfloat/multilingual-e5-small")

# ✅ 처리할 CSV 파일들
CSV_FILES = []

# ✅ 텍스트를 chunk로 분리할 필요가 없으므로 행 단위 처리
all_rows = []

for path in CSV_FILES:
    df = pd.read_csv(path)
    
    # ✅ 모든 열을 문자열로 합쳐서 한 줄로 취급
    for _, row in df.iterrows():
        row_text = " ".join([str(cell) for cell in row if pd.notnull(cell)]).strip()
        if row_text:  # 빈 문자열 제외
            all_rows.append(row_text)

print(f"총 업로드할 문장 수: {len(all_rows)}")

# ✅ 임베딩 및 Pinecone 업로드
batch_size = 32
for i in tqdm(range(0, len(all_rows), batch_size)):
    batch = all_rows[i:i+batch_size]
    texts = [f"passage: {text}" for text in batch]
    embeddings = model.encode(texts, normalize_embeddings=True)

    vectors = [
        {
            "id": f"csv-{i+j}",
            "values": embeddings[j].tolist(),
            "metadata": {"text": texts[j]}
        }
        for j in range(len(batch))
    ]
    index.upsert(vectors=vectors)

print("✅ CSV 데이터 Pinecone 업로드 완료!")
