// DOM 요소
const pickBtn = document.getElementById('pick-btn');
const retryBtn = document.getElementById('retry-btn');
const resultCard = document.getElementById('result-card');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');

const restaurantName = document.getElementById('restaurant-name');
const restaurantCategory = document.getElementById('restaurant-category');
const restaurantDistance = document.getElementById('restaurant-distance');
const restaurantLink = document.getElementById('restaurant-link');

// 음식점 목록 캐시
let restaurantCache = [];
let lastPicked = null;

// CONFIG 검증
function validateConfig() {
    if (typeof CONFIG === 'undefined') {
        throw new Error('CONFIG가 정의되지 않았습니다. config.js 파일을 확인하세요.');
    }

    // Serverless 환경에서는 API 키 검증 생략
    const useServerless = !CONFIG.KAKAO_API_KEY || CONFIG.KAKAO_API_KEY === 'YOUR_KAKAO_REST_API_KEY_HERE';

    if (!useServerless && !CONFIG.KAKAO_API_KEY) {
        throw new Error('Kakao API 키가 설정되지 않았습니다. config.js 파일을 확인하세요.');
    }

    const { latitude, longitude } = CONFIG.LOCATION;
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        throw new Error('잘못된 위도 값입니다.');
    }

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        throw new Error('잘못된 경도 값입니다.');
    }

    if (typeof CONFIG.RADIUS !== 'number' || CONFIG.RADIUS < 0 || CONFIG.RADIUS > 20000) {
        throw new Error('잘못된 반경 값입니다. (0-20000m)');
    }
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    try {
        validateConfig();
        pickBtn.addEventListener('click', pickRestaurant);
        retryBtn.addEventListener('click', pickRestaurant);
    } catch (err) {
        showError(`설정 오류: ${err.message}`);
        pickBtn.disabled = true;
    }
});

// 메인 함수: 음식점 뽑기
async function pickRestaurant() {
    showLoading();
    hideError();
    hideResult();

    try {
        // 캐시가 없으면 API 호출
        if (restaurantCache.length === 0) {
            await fetchRestaurants();
        }

        if (restaurantCache.length === 0) {
            showError('주변에 음식점을 찾을 수 없어요 😢');
            return;
        }

        // 랜덤 선택 (직전 선택과 다르게)
        let picked;
        if (restaurantCache.length === 1) {
            picked = restaurantCache[0];
        } else {
            do {
                const randomIndex = Math.floor(Math.random() * restaurantCache.length);
                picked = restaurantCache[randomIndex];
            } while (picked === lastPicked && restaurantCache.length > 1);
        }

        lastPicked = picked;
        displayResult(picked);

    } catch (err) {
        console.error('Error:', err);
        showError('오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
        hideLoading();
    }
}

// REST API로 음식점 검색
async function fetchRestaurants() {
    const { latitude, longitude } = CONFIG.LOCATION;
    const radius = CONFIG.RADIUS;

    // Serverless API 사용 여부 감지
    const useServerless = !CONFIG.KAKAO_API_KEY || CONFIG.KAKAO_API_KEY === 'YOUR_KAKAO_REST_API_KEY_HERE';

    let url, options;

    if (useServerless) {
        // Vercel Serverless Function 사용 (프로덕션)
        url = `/api/restaurants?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
        options = {}; // Authorization 헤더 불필요 (서버에서 처리)
    } else {
        // 직접 Kakao API 호출 (로컬 개발)
        url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&x=${longitude}&y=${latitude}&radius=${radius}&sort=distance`;
        options = {
            headers: {
                'Authorization': `KakaoAK ${CONFIG.KAKAO_API_KEY}`
            }
        };
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        restaurantCache = data.documents || [];
        console.log(`${restaurantCache.length}개 음식점 발견 (${useServerless ? 'Serverless' : 'Direct'} API)`);
    } catch (error) {
        console.error('API 오류:', error);
        throw error;
    }
}

// 결과 표시
function displayResult(restaurant) {
    restaurantName.textContent = restaurant.place_name;
    
    // 카테고리에서 '음식점 > ' 제거
    const category = restaurant.category_name.replace('음식점 > ', '');
    restaurantCategory.textContent = category;
    
    // 거리 표시
    const distance = parseInt(restaurant.distance);
    restaurantDistance.textContent = `📍 ${distance}m (도보 약 ${Math.ceil(distance / 67)}분)`;
    
    // 카카오맵 링크
    restaurantLink.href = restaurant.place_url;

    showResult();
}

// UI 상태 관리
function showLoading() {
    loading.classList.remove('hidden');
    pickBtn.disabled = true;
    retryBtn.disabled = true;
}

function hideLoading() {
    loading.classList.add('hidden');
    pickBtn.disabled = false;
    retryBtn.disabled = false;
}

function showResult() {
    resultCard.classList.remove('hidden');
    retryBtn.classList.remove('hidden');
}

function hideResult() {
    resultCard.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}
