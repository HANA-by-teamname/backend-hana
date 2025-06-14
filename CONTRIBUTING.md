# Contributing to HANA Backend

환영합니다! 🎉  
HANA 백엔드 프로젝트에 기여해주셔서 감사합니다.  
아래 가이드라인을 참고하여 자유롭게 이슈 제기, 버그 수정, 기능 추가, 문서 개선 등에 참여해 주세요.

---

## 📝 이슈 등록

- 버그, 개선사항, 새로운 기능 제안 등은 [Issues](https://github.com/HANA-by-teamname/backend-hana/issues) 탭에 등록해 주세요.
- 가능한 한 명확하게 재현 방법, 기대 동작, 실제 동작을 작성해 주세요.
- [bug_report.md](/.github/ISSUE_TEMPLATE/bug_report.md)와 [feature_request.md](/.github/ISSUE_TEMPLATE/feature_request.md) 템플릿을 참고해 주세요.

---

## 🌱 Pull Request(PR) 기여 방법

1. **Fork & Clone**
   - 본인 계정으로 fork한 뒤, 로컬로 clone해 주세요.

2. **새 브랜치 생성**
   - 기능/버그별로 새로운 브랜치를 만들어 작업해 주세요.
   - 예시:  
     `git checkout -b feat/feed-search`  
     `git checkout -b fix/login-error`

3. **커밋 메시지 규칙**
   - [Git Commit Message Convention](https://purrfect-whip-47f.notion.site/Git-Commit-Message-Convention-1d56d4b96cc48011a5c8f2df0cf4dc37)을 지켜주세요.
   - 예시:
     ```
     feat: 카카오/구글 로그인 기능 구현
     fix: 챗봇 백엔드 연동 관련 코드 수정
     docs: README.md 업데이트
     ```

4. **코드 작성 및 테스트**
   - 변경 사항이 기존 기능에 영향을 주지 않는지 충분히 테스트해 주세요.
   - 가능하다면 cURL 예시도 [curl.md](curl.md) 파일에 추가해 주세요.

5. **PR 생성**
   - PR 제목과 설명을 명확하게 작성해 주세요.
   - 관련 이슈가 있다면 `Ref #이슈번호`를 본문에 포함해 주세요.
   - 해결된 이슈가 있을 경우, 본문에 `Closes #이슈번호` 또는 `Fixes #이슈번호`를 포함해주세요  
   (PR이 merge될 때 해당 이슈가 자동으로 닫힙니다.)

---

## 💡 코드 스타일

- 들여쓰기는 2칸(스페이스)로 통일해 주세요.
- 코드 포맷팅은 [Prettier](https://prettier.io/)를 사용해 정렬하는 것을 권장합니다.
  - VSCode 등에서 Prettier 확장 설치가 가능합니다.
- 변수명, 함수명은 일관성 있게 작성해 주세요.
- 불필요한 콘솔 로그, 주석 등은 PR 전 정리해 주세요.

---

감사합니다!  
함께 더 나은 HANA를 만들어가요 🚀