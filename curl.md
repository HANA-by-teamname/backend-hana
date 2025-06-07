# 테스트 cURL 명령어

## 회원가입
``` bash
curl -X POST http://localhost:4000/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "email": "abc@cau.ac.kr",
  "password": "abc",
  "name": "김중앙",
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
``` bash
curl -X POST http://localhost:4000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "abc@cau.ac.kr",
  "password": "abc"
}'
```

## 피드 검색
``` bash
curl -X POST http://localhost:4000/feeds/search \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {your_token}" \
-d '{"keyword":"장학금","faculty":["중앙대학교 NOTICE","소프트웨어학부"],"sort":"최신순"}'
```

## 관심목록 추가
``` bash
curl -X POST http://localhost:4000/favorites/add \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {your_token}" \
-d '{"feed_id": "피드ID"}'
```

## 관심목록 삭제
``` bash
curl -X POST http://localhost:4000/favorites/delete \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {your_token}" \
-d '{"feed_id": "피드ID"}'
```

## 관심목록 조회
``` bash
curl -X GET http://localhost:4000/favorites/list \
-H "Authorization: Bearer {your_token}"
```