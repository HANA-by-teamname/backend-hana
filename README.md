# HANA Backend

## 🌏 프로젝트 소개

> 하나뿐인 유학생활을 위한 통합 플랫폼  
> **HANA**의 Backend Repository입니다.

---

## 📁 프로젝트 구조

```
backend-hana/
│
├── .github/           # GitHub Actions 워크플로우, 이슈 템플릿 등
├── data/              # 공지사항 크롤링 데이터 파일 및 데이터 import 스크립트
├── middlewares/       # JWT 인증 등 Express 미들웨어
├── models/            # MongoDB 모델 (User, Feed, Favorite 등)
├── python-ai/         # Python 기반 AI/챗봇 코드 및 requirements.txt
├── routes/            # API 라우터 (회원가입, 로그인, 피드, 챗봇 등)
│
├── .gitignore         # Git 및 배포 제외 파일/폴더 설정
├── CONTRIBUTING.md    # 기여 방법 설명
├── LICENSE            # 라이선스 파일
├── README.md          # 프로젝트 설명
├── curl.md            # API 테스트용 cURL 명령어 모음
├── index.js           # 백엔드 핵심 진입점 (라우터 등록, 서버 실행 등)
├── package-lock.json  # Node.js 의존성 트리 (정확한 버전 고정, 재현성 보장)
└── package.json       # Node.js 프로젝트 메타 정보 및 의존성
```

---

## 🛠️ 기술 스택

| 기술              | 설명                                 |
|-------------------|--------------------------------------|
| **JavaScript**    | 주요 개발 언어                       |
| **Node.js**       | 백엔드 서버                          |
| **Express.js**    | Node.js용 웹 프레임워크              |
| **MongoDB**       | NoSQL 데이터베이스                   |
| **Mongoose**      | MongoDB ODM 라이브러리               |
| **JWT**           | 인증 및 보안                         |
| **Python**        | AI/임베딩/챗봇 기능                  |
| **Ollama**        | LLM 서버 (llama3)                    |
| **Pinecone**      | 벡터 데이터베이스                    |
| **AWS EC2**       | 배포 서버                            |
| **GitHub Actions**| CI/CD 자동화                         |
| **Postman**       | API 테스트 및 문서화 도구            |
| **VSCode**        | 주요 개발 에디터                     |

---

## 📦 설치 및 실행 방법

### 1. 필수 프로그램 설치

- **Node.js**: [Node.js 공식 사이트](https://nodejs.org/)
- **Python**: [Python 공식 사이트](https://www.python.org/downloads/)
- **Git**: [Git 공식 사이트](https://git-scm.com/download/win)
- **MongoDB**: [MongoDB 공식 사이트](https://www.mongodb.com/try/download/community)  
  (로컬 개발/테스트용, Atlas를 쓸 경우 생략 가능)
- **Ollama**: [Ollama 공식 사이트](https://ollama.com/download)
- **VSCode**: [VSCode 공식 사이트](https://code.visualstudio.com/) (선택)

### 2. 저장소 클론

```bash
git clone https://github.com/HANA-by-teamname/backend-hana.git
cd backend-hana
```

### 3. 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 아래와 같이 생성하세요.
각 항목에 실제로 사용할 값을 입력해 주세요.

```env
PORT=your_port
SECRET_KEY=your_secret_key
DATABASE_URL=your_mongodb_url
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_REDIRECT_URI=your_kakao_redirect_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
PINECONE_API_KEY=your_pinecone_api_key
PYTHON_SCRIPT_PATH=./python-ai/chatbot.py
```

각 항목 설명

- **PORT**: 서버가 실행될 포트 번호
- **SECRET_KEY**: JWT 등에서 사용하는 비밀 키
- **DATABASE_URL**: MongoDB(Atlas 또는 로컬) 접속 주소
- **KAKAO_CLIENT_ID / KAKAO_REDIRECT_URI**: 카카오 소셜 로그인 연동 정보
- **GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI**: 구글 소셜 로그인 연동 정보
- **PINECONE_API_KEY**: Pinecone 벡터DB API 키
- **PYTHON_SCRIPT_PATH**: Python 챗봇 스크립트 경로

### 4. Node.js 의존성 설치

```bash
npm install
```

### 5. Python 가상환경 및 패키지 설치

```bash
cd python-ai
python -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..
```

### 6. 피드 데이터 저장

```bash
node data/importFeeds.js
```

### 7. 서버 실행

```bash
npm start
```

---

## 📑 API 문서
- HANA API 문서는 [Postman Docs](https://documenter.getpostman.com/view/45329803/2sB2x6nsYn)에서 확인할 수 있습니다.  
- 웹 문서에서 각 API 설명과 예시를 확인할 수 있으며,  
**"Run in Postman"** 버튼을 클릭하면 Postman 앱에서 바로 import하여 테스트할 수 있습니다.

---

## 🙋 문의 및 기여

- 자세한 기여 방법은 [CONTRIBUTING.md](CONTRIBUTING.md) 파일을 참고해 주세요.
- 이슈/버그/기능 제안은 [Issues](https://github.com/HANA-by-teamname/backend-hana/issues) 탭을 이용해 주세요.

---

## 📄 라이선스

- 본 프로젝트는 MIT LICENSE를 따릅니다.
- 자세한 내용은 [LICENSE](LICENSE) 파일을 참고해 주세요.