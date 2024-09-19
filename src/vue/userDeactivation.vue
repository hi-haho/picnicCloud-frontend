<template>
  <div>
    <h2>계정 비활성화 확인</h2>
    <p>정말로 계정을 비활성화하시겠습니까?</p>
    <button v-if="isLoggedIn" @click="confirmDeactivation">확인</button>
    <button v-if="isLoggedIn" @click="cancelDeactivation">취소</button>
    <p v-else>로그인 상태가 아닙니다. 계정 비활성화를 진행할 수 없습니다.</p>
  </div>
</template>

<script>
import apiClient from "@/api/api.js"; // apiClient를 가져옵니다.
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]), // Vuex에서 로그아웃 액션을 가져옵니다.
    async confirmDeactivation() {
      try {
        // 계정 비활성화 요청
        const response = await apiClient.post("/mypage/deactivate");
        if (response.status === 200) {
          alert("계정이 비활성화되었습니다.");
          // 로그아웃 처리
          await this.logout();
          // 메인 화면으로 이동
          this.$router.push("/");
        }
      } catch (error) {
        console.error("계정 비활성화 실패:", error);
        alert("계정 비활성화에 실패했습니다.");
      }
    },
    cancelDeactivation() {
      // 계정 비활성화 취소 처리
      this.$router.push("/myPage"); // 예: 내 정보 페이지로 이동
    },
  },
};
</script>
