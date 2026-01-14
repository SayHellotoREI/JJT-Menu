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

// Kakao SDK 초기화
document.addEventListener('DOMContentLoaded', () => {
    // Kakao SDK 초기화
    if (typeof Kakao !== 'undefined') {
        Kakao.init(CONFIG.KAKAO_API_KEY);
        console.log('Kakao SDK 초기화:', Kakao.isInitialized());
    } else {
        console.error('Kakao SDK 로드 실패');
        showError('카카오 SDK를 불러오지 못했어요.');
    }

    pickBtn.addEventListener('click', pickRestaurant);
    retryBtn.addEventListener('click', pickRestaurant);
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

// 카카오 SDK로 음식점 검색
function fetchRestaurants() {
    return new Promise((resolve, reject) => {
        const { latitude, longitude } = CONFIG.LOCATION;
        const radius = CONFIG.RADIUS;

        Kakao.API.request({
            url: '/v2/local/search/category.json',
            data: {
                category_group_code: 'FD6',
                x: longitude,
                y: latitude,
                radius: radius,
                sort: 'distance'
            },
            success: function(response) {
                restaurantCache = response.documents || [];
                console.log(`${restaurantCache.length}개 음식점 발견`);
                resolve();
            },
            fail: function(error) {
                console.error('API 오류:', error);
                reject(error);
            }
        });
    });
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
