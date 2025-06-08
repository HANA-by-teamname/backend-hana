# 테스트 cURL 명령어

## 회원가입
``` bash
curl -X POST http://localhost:4000/users/signup \
-H "Content-Type: application/json" \
-d '{
  "email": "abc@cau.ac.kr",
  "password": "abc",
  "name": "김중앙",
  "nickname": "푸앙티비",
  "gender": "여자",
  "birthdate": "2002-11-09",
  "faculty": "중앙대학교",
  "data_sources": ["소프트웨어학부", "경영학부", "AI학부"],
  "native_language": "베트남어",
  "terms_agreement": true,
  "privacy_agreement": true,
  "marketing_agreement": false,
  "third_party_agreement": false
}'
```

## 로그인
``` bash
curl -X POST http://localhost:4000/users/login \
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
-d '{"keyword":"장학금", "sort":"최신순"}'
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

## 챗봇 질문/답변
``` bash
curl -X POST http://localhost:4000/chatbot/message \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {your_token}" \
-d '{"message": "How to get to Chung-Ang University's Blue Mir Hall domitory?"}'
```

## 챗봇 히스토리 조회
``` bash
curl -X GET http://localhost:4000/chatbot/history \
-H "Authorization: Bearer {your_token}"
```

## 시간표 과목 추가
``` bash
curl -X POST http://localhost:4000/timetable/add \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {your_token}" \
-d '{
  "subject": "오픈소스SW프로젝트",
  "day": "월",
  "start_time": "13:00",
  "end_time": "15:00",
  "professor": "김영빈",
  "location": "310관 727호"
}'
```

## 시간표 과목 삭제
``` bash
curl -X DELETE http://localhost:4000/timetable/delete \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {your_token}" \
-d '{
  "subject": "오픈소스SW프로젝트",
  "day": "월",
  "start_time": "13:00"
}'
```

## 시간표 조회
``` bash
curl -X GET http://localhost:4000/timetable \
-H "Authorization: Bearer {your_token}"
```