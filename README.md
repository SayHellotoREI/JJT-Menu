# 🍽️ 오늘 뭐 먹지? - 과천 점심 메뉴 추천기

과천 지역 점심 메뉴를 랜덤으로 추천해주는 간단한 웹앱입니다.

## 📁 파일 구조

```
lunch-picker/
├── index.html    # 메인 페이지
├── style.css     # 스타일
├── app.js        # 로직
├── config.js     # 설정 (API 키, 좌표)
└── README.md     # 이 파일
```

## 🚀 배포 방법

### 방법 1: GitHub Pages (추천)

1. GitHub에 새 저장소 생성 (예: `lunch-picker`)
2. 모든 파일 업로드
3. Settings > Pages > Source를 `main` 브랜치로 설정
4. 몇 분 후 `https://[username].github.io/lunch-picker` 에서 접속 가능

### 방법 2: Vercel

1. [Vercel](https://vercel.com) 가입
2. GitHub 연동 또는 파일 직접 업로드
3. 자동 배포 완료

### 방법 3: Netlify

1. [Netlify](https://netlify.com) 가입
2. 폴더를 드래그 앤 드롭
3. 즉시 배포 완료

## ⚙️ 설정 변경

`config.js` 파일에서 수정 가능:

```javascript
const CONFIG = {
    KAKAO_API_KEY: 'your-api-key',  // 카카오 API 키
    LOCATION: {
        latitude: 37.4292,           // 위도
        longitude: 126.9897          // 경도
    },
    RADIUS: 500,                     // 검색 반경 (미터)
    CATEGORY: 'FD6'                  // 카테고리 (FD6=음식점)
};
```

## 🔐 API 키 보안 설정

카카오 개발자 콘솔에서 도메인 제한 설정을 권장합니다:

1. [Kakao Developers](https://developers.kakao.com) 접속
2. 내 애플리케이션 > 앱 선택
3. 플랫폼 > Web > 사이트 도메인 등록
   - 예: `https://username.github.io`

## 📝 향후 추가 기능 아이디어

- [ ] 카테고리 필터 (한식/중식/일식 등)
- [ ] 자체 평점 시스템
- [ ] 추천 히스토리
- [ ] "오늘은 이거 싫어" 제외 기능
- [ ] PWA 지원 (홈 화면 추가)

## 🐛 문제 해결

### API 호출 오류
- 카카오 개발자 콘솔에서 API 키 확인
- 도메인 제한 설정 확인
- 브라우저 콘솔(F12)에서 오류 메시지 확인

### 음식점이 안 나와요
- `config.js`의 좌표 확인
- 검색 반경 늘려보기 (500 → 1000)
