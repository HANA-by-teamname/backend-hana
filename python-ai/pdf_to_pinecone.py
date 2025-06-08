import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
from tqdm import tqdm
from dotenv import load_dotenv
load_dotenv()

# ✅ 환경 변수 설정
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("chatbot")

# ✅ 임베딩 모델 로드
model = SentenceTransformer("intfloat/multilingual-e5-small")

# ✅ PDF 경로 설정(필요한 파일 경로 넣기)
PDF_FILES = []

# ✅ Pinecone 초기화 및 인덱스 준비

# 인덱스가 없으면 생성 (dimension은 임베딩 모델에 맞게, 예: MiniLM-L12-v2는 384)
# if INDEX_NAME not in [idx.name for idx in pc.list_indexes()]:
#     pc.create_index(
#         name=INDEX_NAME,
#         dimension=384,
#         metric="cosine",
#         spec=ServerlessSpec(
#             cloud="",      # 또는 "aws"
#             region="us-east1" # region은 Pinecone 콘솔에서 확인
#         )
#     )

# ✅ PDF 문서 로딩 및 분할
text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=100)
all_docs = []

for path in PDF_FILES:
    loader = PyPDFLoader(path)
    pages = loader.load()
    chunks = text_splitter.split_documents(pages)
    all_docs.extend(chunks)

print(f"총 chunk 수: {len(all_docs)}")

# ✅ 문단 임베딩 후 Pinecone에 업로드
batch_size = 32
for i in tqdm(range(0, len(all_docs), batch_size)):
    batch = all_docs[i:i+batch_size]
    texts = [f"passage: {doc.page_content}" for doc in batch]
    embeddings = model.encode(texts, normalize_embeddings=True)

    vectors = [
        {
            "id": f"doc-{i+j}",
            "values": embeddings[j].tolist(),
            "metadata": {"text": texts[j]}
        }
        for j in range(len(batch))
    ]
    index.upsert(vectors=vectors)

print("✅ Pinecone 업로드 완료!")
