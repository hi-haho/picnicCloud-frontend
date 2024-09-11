<template>
  <div class="container mt-4">
    <h2>신고유형</h2>
    <form @submit.prevent="submitReport">
      <div class="form-group">
        <input type="radio" id="Repo1" value="1" v-model="selectedReportCode">
        <label for="Repo1"> 불쾌한 표현 사용</label><br>
        <input type="radio" id="Repo2" value="2" v-model="selectedReportCode">
        <label for="Repo2"> 관련없는 게시글</label><br>
        <input type="radio" id="Repo3" value="3" v-model="selectedReportCode">
        <label for="Repo3"> 스팸/홍보 글</label><br>
        <input type="radio" id="Repo4" value="4" v-model="selectedReportCode">
        <label for="Repo4"> 음란물</label><br>
        <input type="radio" id="Repo5" value="5" v-model="selectedReportCode">
        <label for="Repo5"> 청소년에게 유해한 내용</label><br>
      </div>
      <div class="form-group mt-3">
        <button type="submit" class="btn btn-outline-danger">신고하기</button>
      </div>
    </form>
  </div>
</template>

<script>
import apiClient from "@/api/api.js";
import { useRouter, useRoute } from "vue-router";
import { ref } from 'vue';
import { getUserIdFromToken } from '@/utils/auth';
import '@/css/fleaReporte.css'

export default {
  name: 'fleaMarketReport',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const selectedReportCode = ref(null); // 선택한 신고 유형의 코드
    const itemNo = ref(route.params.no); // URL 파라미터에서 아이템 번호 가져오기
    const userId = ref(getUserIdFromToken()); // 현재 사용자 ID 가져오기

    // 신고 처리 함수
    const submitReport = async () => {
      if (selectedReportCode.value === null) {
        alert('신고 유형을 선택해 주세요.');
        return;
      }
      if (itemNo.value === null) {
        alert('게시글 번호를 다시 선택해 주세요.');
        return;
      }
      if (userId.value === null) {
        alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
        router.push("/login");
        return;
      }
      
      try {
        const response = await apiClient.post('/fleaMarket/report', {
          reportCode: Number(selectedReportCode.value), // 숫자형으로 변환하여 전송
          fleaBoardNo: Number(itemNo.value), // 숫자형으로 변환하여 전송
          userId: userId.value
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

       const message = response.data;
        if (message === "신고 성공") {
          alert('신고가 완료되었습니다.');
        } else if (message === "이미 신고됨") {
          alert('이미 신고한 게시글입니다.');
        } else if (message === "잘못된 입력입니다.") {
          alert('잘못된 입력입니다. 다시 시도해 주세요.');
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
        }

        router.push(`/fleaMarketDetail/${itemNo.value}`);
      } catch (error) {
        console.error('Error:', error);
        alert('신고 실패. 다시 시도해 주세요.');
      }
    };

    return {
      selectedReportCode,
      submitReport
    };
  }
};
</script>
