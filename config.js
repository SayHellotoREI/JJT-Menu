// 설정 파일 템플릿
// 이 파일을 config.js로 복사하고 실제 API 키를 입력하세요.

const CONFIG = {
    // 카카오 REST API 키 (Kakao Developers > 앱 설정 > 앱 키 > REST API 키)
    // 1. https://developers.kakao.com 에서 앱 생성
    // 2. 앱 설정 > 앱 키 > REST API 키 복사
    // 3. 아래에 붙여넣기
    KAKAO_API_KEY: 'YOUR_KAKAO_REST_API_KEY_HERE',

    // 고정 위치 좌표 (기본값: 경기 과천시 과천대로7길 74)
    // 카카오맵에서 원하는 위치의 좌표를 찾을 수 있습니다.
    LOCATION: {
        latitude: 37.4174891,
        longitude: 126.9776386
    },

    // 검색 반경 (미터 단위)
    // 최소: 0, 최대: 20000 (20km)
    RADIUS: 350,

    // 검색 카테고리 (FD6 = 음식점)
    // 다른 카테고리: CE7(카페), MT1(대형마트) 등
    CATEGORY: 'FD6'
};
