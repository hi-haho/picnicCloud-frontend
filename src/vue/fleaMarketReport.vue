<template>
  <div class="container mt-4">
    <h2>신고유형</h2>
    <form @submit.prevent="submitReport">
      <div class="form-group">
        <input type="radio" id="Repo1" value="1" v-model="selectedReportCode">
        <label for="Repo1"> 불쾌한 표현 사용</label><br>
        <input type="radio" id="Repo2" value="2" v-model="selectedReportCode">
        <label for="Repo2"> 관련없는 리뷰</label><br>
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
import axios from 'axios';

export default {
  name: 'fleaMarketReport',
  data() {
    return {
      selectedReportCode: null,
      itemNo: null,
      userId: 'user1' // 로그인 상태에서 실제 사용자 ID를 가져와야 함
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.itemNo = urlParams.get('no');
    this.userId = urlParams.get('id'); // 실제 로그인 상태에서 가져와야 함

    // 로그인 안된 경우 로그인 페이지로 이동
    // if (!this.userId) {
    //   alert('로그인 후 이용해 주세요.');
    //   window.location.href = 'login.html'; // 로그인 페이지로 리다이렉트
    // }
  },
  methods: {
    async submitReport() {
      if (!this.selectedReportCode) {
        alert('신고 유형을 선택해 주세요.');
        return;
      }
      try {
        await axios.post('/fleaMarket/report', {
          reportCode: this.selectedReportCode,
          fleaBoardNo: this.itemNo,
          userId: this.userId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert('신고가 완료되었습니다.');
        window.location.href = `fleamarket.html?no=${this.itemNo}`; // 신고 후 이동할 페이지
      } catch (error) {
        console.error('Error:', error);
        alert('신고 실패. 다시 시도해 주세요.');
      }
    }
  }
};
</script>