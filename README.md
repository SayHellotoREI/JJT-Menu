# 🍽️ 오늘 뭐 먹지? - 과천 점심 메뉴 추천기

과천 지역 점심 메뉴를 랜덤으로 추천해주는 간단한 웹앱입니다.

## 📁 파일 구조

```
JJT-Menu/
├── index.html         # 메인 페이지
├── style.css          # 스타일
├── app.js             # 로직
├── config.example.js  # 설정 템플릿
├── config.js          # 실제 설정 (Git에 포함 안됨)
├── .gitignore         # Git 무시 파일 목록
└── README.md          # 이 파일
```

## 🚀 시작하기

### 1️⃣ API 키 발급

1. [Kakao Developers](https://developers.kakao.com) 접속 및 로그인
2. **내 애플리케이션 > 애플리케이션 추가하기**
3. 앱 이름 입력 후 생성
4. **앱 설정 > 앱 키** 메뉴에서 **REST API 키** 복사

### 2️⃣ 설정 파일 생성

```bash
# config.example.js를 config.js로 복사
cp config.example.js config.js
```

`config.js` 파일을 열고 발급받은 REST API 키를 입력:

```javascript
const CONFIG = {
    KAKAO_API_KEY: '여기에_발급받은_REST_API_키_붙여넣기',
    // ...
};
```

### 3️⃣ 도메인 보안 설정 (필수!)

1. [Kakao Developers](https://developers.kakao.com) > 내 애플리케이션
2. **앱 설정 > 플랫폼 > Web 플랫폼 추가**
3. **사이트 도메인** 등록:
   ```
   http://localhost:5500
   http://127.0.0.1:5500
   https://your-username.github.io
   ```
4. 저장

⚠️ **중요**: 등록하지 않은 도메인에서는 API가 작동하지 않습니다!

### 4️⃣ 로컬 실행

- VS Code의 Live Server 확장 설치 후 `index.html` 우클릭 > "Open with Live Server"
- 또는 간단한 HTTP 서버 실행:
  ```bash
  python3 -m http.server 8000
  # http://localhost:8000 접속
  ```

## 🌐 배포 방법

### 방법 1: GitHub Pages (추천)

1. GitHub에 새 저장소 생성
2. **config.js는 제외하고** 나머지 파일 업로드
3. GitHub Pages 설정:
   - Settings > Pages > Source: `main` 브랜치
4. 배포된 URL을 Kakao Developers 도메인에 추가
5. 배포 환경에서 브라우저 콘솔로 config.js 내용 붙여넣기 (임시)

⚠️ **주의**: GitHub Pages는 정적 파일만 호스팅하므로, config.js를 Git에 포함하면 API 키가 공개됩니다!

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

## 🔐 보안 가이드

### ⚠️ 절대 하지 말아야 할 것

❌ **config.js를 Git에 커밋하지 마세요!**
   - API 키가 GitHub에 공개됩니다
   - `.gitignore`에 이미 추가되어 있습니다

❌ **API 키를 스크린샷이나 SNS에 공유하지 마세요**

❌ **REST API 키와 JavaScript 키를 혼동하지 마세요**
   - 이 프로젝트는 **REST API 키**를 사용합니다

### ✅ 보안 체크리스트

- [x] `.gitignore`에 `config.js` 추가됨
- [ ] Kakao Developers에서 Web 플랫폼 도메인 등록
- [ ] 사용하지 않는 API 키는 비활성화
- [ ] 정기적으로 API 사용량 모니터링

### 🚨 API 키가 노출된 경우

1. **즉시 Kakao Developers에서 해당 키 삭제**
2. **새 REST API 키 발급**
3. **Git 히스토리에서 키 제거** (git filter-branch 또는 BFG 사용)
4. **config.js를 새 키로 업데이트**

### 🔒 보안 강화 방법

**현재 프로젝트 (프론트엔드만):**
- ✅ 도메인 제한 설정 (Kakao Developers)
- ⚠️ API 키는 여전히 브라우저에 노출됨 (개발자 도구로 확인 가능)

**프로덕션 레벨 보안 (백엔드 필요):**
- 백엔드 프록시 서버 구축
- Serverless Functions (Vercel/Netlify) 사용
- API 키를 서버 환경변수로 관리

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
