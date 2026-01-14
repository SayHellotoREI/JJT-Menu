/**
 * Vercel Serverless Function - 카카오 로컬 API 프록시
 * API 키를 서버 환경변수로 관리하여 클라이언트에 노출되지 않음
 */

export default async function handler(req, res) {
    // CORS 헤더 설정 (모든 도메인 허용, 필요시 제한 가능)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // GET 요청만 허용
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 쿼리 파라미터 추출
    const { latitude, longitude, radius = 500 } = req.query;

    // 입력 검증
    if (!latitude || !longitude) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'latitude와 longitude 파라미터가 필요합니다.'
        });
    }

    // 위도/경도 범위 검증
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseInt(radius);

    if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({
            error: 'Invalid latitude',
            message: '위도는 -90에서 90 사이여야 합니다.'
        });
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).json({
            error: 'Invalid longitude',
            message: '경도는 -180에서 180 사이여야 합니다.'
        });
    }

    if (isNaN(rad) || rad < 0 || rad > 20000) {
        return res.status(400).json({
            error: 'Invalid radius',
            message: '반경은 0에서 20000 사이여야 합니다.'
        });
    }

    // 환경변수에서 API 키 가져오기
    const apiKey = process.env.KAKAO_API_KEY;

    if (!apiKey) {
        console.error('KAKAO_API_KEY 환경변수가 설정되지 않았습니다.');
        return res.status(500).json({
            error: 'Server configuration error',
            message: 'API 키가 설정되지 않았습니다.'
        });
    }

    try {
        // 카카오 로컬 API 호출 (size=15가 최대)
        const kakaoUrl = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&x=${lng}&y=${lat}&radius=${rad}&sort=distance&size=15`;

        const response = await fetch(kakaoUrl, {
            headers: {
                'Authorization': `KakaoAK ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Kakao API error: ${response.status}`);
        }

        const data = await response.json();

        // 성공 응답
        return res.status(200).json(data);

    } catch (error) {
        console.error('Kakao API 호출 실패:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: '카카오 API 호출 중 오류가 발생했습니다.'
        });
    }
}
