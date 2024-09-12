// 토큰값이 있는 경우, 유틸리티 모듈 

import jwt_decode from 'jwt-decode';

// JWT 토큰에서 사용자 ID 추출
export function getUserIdFromToken() {
  const token = localStorage.getItem("token"); // JWT 토큰을 가져옴
  if (!token) return null;
  const decodedToken = jwt_decode(token);
  const currentTime = Math.floor(Date.now() / 1000);

  if (decodedToken.exp < currentTime) {
    // 토큰이 만료되었을 경우
    localStorage.removeItem("token");
    return null;
  }

  return decodedToken.sub;
}
