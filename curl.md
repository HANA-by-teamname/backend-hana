# 테스트 curl 명령

## 회원가입
- 성공
``` bash
curl -X POST http://localhost:4000/users/signup \
-H "Content-Type: application/json" \
-d '{
  "email": "abc@cau.ac.kr",
  "password": "abc",
  "nickname": "푸앙티비",
  "gender": "여자",
  "birthdate": "2002-11-09",
  "faculty": "중앙대학교",
  "native_language": "베트남어",
  "terms_agreement": true,
  "privacy_agreement": true,
  "marketing_agreement": false,
  "third_party_agreement": false
}'
```

## 로그인
- 성공
``` bash
curl -X POST http://localhost:4000/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "abc@cau.ac.kr",
  "password": "abc"
}'
```