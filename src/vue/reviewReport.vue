<template>
    <div class="container mt-4">
      <h2>신고유형</h2>
      <form @submit.prevent="submitReport">
        <div class="form-group">
          <!-- 신고 사유 선택 (radio 버튼) -->
          <input type="radio" id="Repo1" value="1" v-model="selectedReportCode" />
          <label for="Repo1"> 불쾌한 표현 사용</label><br />
  
          <input type="radio" id="Repo2" value="2" v-model="selectedReportCode" />
          <label for="Repo2"> 관련없는 게시글</label><br />
  
          <input type="radio" id="Repo3" value="3" v-model="selectedReportCode" />
          <label for="Repo3"> 스팸/홍보 글</label><br />
  
          <input type="radio" id="Repo4" value="4" v-model="selectedReportCode" />
          <label for="Repo4"> 음란물</label><br />
  
          <input type="radio" id="Repo5" value="5" v-model="selectedReportCode" />
          <label for="Repo5"> 청소년에게 유해한 내용</label><br />
        </div>
  
        <!-- 신고 버튼 -->
        <div class="form-group mt-3">
          <button type="submit" class="btn btn-outline-danger">신고하기</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import apiClient from "@/api/api.js";
  import jwtDecode from "jwt-decode"; // JWT 디코딩을 위해 추가
  
  export default {
    props: ["reviewNo"], // 라우팅에서 전달된 reviewNo를 props로 받음
    data() {
      return {
        selectedReportCode: "", // 선택된 신고 코드 (radio 버튼 선택값)
        userId: null, // 사용자 ID를 저장할 변수
      };
    },
    created() {
      // JWT 토큰에서 사용자 정보 추출
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token); // JWT 토큰을 디코딩하여 사용자 정보 추출
        console.log("Decoded Token:", decodedToken); // 토큰 전체 내용 출력
  
        // JWT 토큰에서 사용자 ID(userId)를 추출하여 저장
        this.userId = decodedToken.userId || decodedToken.sub; // JWT 필드에서 userId 또는 sub 필드를 사용
        console.log("로그인한 사용자 ID:", this.userId);
      } else {
        alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
        this.$router.push("/login"); // 로그인 페이지로 이동
      }
    },
    methods: {
      // 신고 제출 메서드
      submitReport() {
        // 신고 코드가 선택되지 않은 경우 처리
        if (!this.selectedReportCode) {
          alert("신고 유형을 선택해주세요.");
          return;
        }
  
        // userId가 null인 경우 처리 (로그인되지 않은 상태)
        if (!this.userId) {
          alert("로그인 후 신고가 가능합니다.");
          return;
        }
  
        // 서버에 보낼 신고 데이터
        const reportData = {
          userId: this.userId, // 로그인한 사용자의 ID
          reviewNo: this.reviewNo, // 신고할 리뷰 번호
          code: this.selectedReportCode, // 선택된 신고 코드
        };
  
        // 데이터 확인용 로그
        console.log("Report Data:", reportData);
  
        // Axios POST 요청
        apiClient
          .post("/review/report", reportData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT 토큰 헤더 추가
            },
          })
          .then(() => {
            alert("신고가 성공적으로 접수되었습니다."); //
            this.$router.push("/"); // 신고 후 메인 페이지로 이동
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              alert("이미 신고된 리뷰입니다."); //
            } else {
              alert("신고 처리 중 오류가 발생했습니다.");
            }
            console.error("신고 제출 중 오류 발생:", error);
          });
      },
    },
  };
  </script>