# 🍽️ 오늘 뭐 먹지? - 과천 점심 메뉴 추천기

과천 지역 점심 메뉴를 랜덤으로 추천해주는 간단한 웹앱입니다.

## 📁 파일 구조

```
JJT-Menu/
├── api/
│   └── restaurants.js # Vercel Serverless Function (API 프록시)
├── index.html         # 메인 페이지
├── style.css          # 스타일
├── app.js             # 로직 (자동으로 Serverless/Direct API 선택)
├── config.js          # 설정 파일 (템플릿, 로컬 개발용)
├── vercel.json        # Vercel 배포 설정
├── .env.example       # 환경변수 예시
├── .gitignore         # Git 무시 파일 목록
└── README.md          # 이 파일
```

## 🚀 시작하기

### 1️⃣ API 키 발급

1. [Kakao Developers](https://developers.kakao.com) 접속 및 로그인
2. **내 애플리케이션 > 애플리케이션 추가하기**
3. 앱 이름 입력 후 생성
4. **앱 설정 > 앱 키** 메뉴에서 **REST API 키** 복사

### 2️⃣ API 키 설정

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

### 방법 1: Vercel (추천 ⭐ - API 키 완전히 숨김!)

**장점**: API 키가 완전히 안전하게 서버 환경변수로 관리됨

#### 1️⃣ Vercel 계정 생성
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인

#### 2️⃣ 프로젝트 배포
1. **New Project** 클릭
2. GitHub 저장소 Import
3. **Deploy** 클릭 (일단 배포)

#### 3️⃣ 환경변수 설정 (중요!)
1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 환경변수 추가:
   ```
   Name: KAKAO_API_KEY
   Value: (발급받은 REST API 키)
   ```
4. **Save** 클릭

#### 4️⃣ 재배포
1. **Deployments** 탭으로 이동
2. 최신 배포 옆 **...** → **Redeploy** 클릭

✅ **완료!** 이제 API 키가 서버에만 있고, 브라우저에 노출되지 않습니다!

---

### 방법 2: GitHub Pages (로컬 개발용)

⚠️ **주의**: GitHub Pages는 정적 호스팅만 지원하므로 API 키가 노출됩니다.

1. GitHub 저장소를 Fork
2. `config.js`에 실제 API 키 입력 후 커밋 (본인 저장소에만)
3. Settings > Pages > Source: `main` 브랜치
4. 배포 완료

**단점**: API 키가 코드에 노출되므로 개인 프로젝트에만 사용 권장

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

**✅ Vercel 배포 시 (완벽한 보안):**
- API 키가 서버 환경변수로 관리됨
- 브라우저에 API 키 절대 노출 안됨
- `/api/restaurants` 엔드포인트가 프록시 역할
- 개발자 도구로 확인해도 API 키 없음

**⚠️ 로컬 개발 또는 GitHub Pages:**
- API 키가 `config.js`에 노출됨
- 도메인 제한 설정 (Kakao Developers)
- 개인 프로젝트에만 권장

**배포 방식별 보안 수준:**
| 배포 방식 | 보안 수준 | API 키 노출 |
|----------|----------|-----------|
| Vercel | ⭐⭐⭐⭐⭐ | ❌ 노출 안됨 |
| Netlify Functions | ⭐⭐⭐⭐⭐ | ❌ 노출 안됨 |
| GitHub Pages | ⭐⭐ | ✅ 코드에 노출 |
| 로컬 개발 | ⭐⭐⭐ | ✅ 로컬에만 |

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
