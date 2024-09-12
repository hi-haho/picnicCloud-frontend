<template>
    <div class="reset-password-confirm-container" v-if="!isLoading">
      <div v-if="isValidToken">
        <h2>비밀번호 재설정</h2>
        <p>비밀번호를 새로 설정할 수 있는 페이지로 이동합니다.</p>
        <button @click="goToResetPassword">확인</button>
      </div>
      <div v-else>
        <h2>유효하지 않은 토큰입니다</h2>
        <p>비밀번호 재설정 토큰이 유효하지 않습니다. 다시 시도해주세요.</p>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from "@/api/api";
  
  export default {
    props: {
      token: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isValidToken: false,
        isLoading: true
      };
    },
    async mounted() {
      if (this.token) {
        try {
          const response = await apiClient.get("/auth/reset-password", {
            params: { token: this.token }
          });
  
          if (response.status === 200) {
            this.isValidToken = true;
          } else {
            this.isValidToken = false;
          }
        } catch (error) {
          console.error(error);
          this.isValidToken = false;
        } finally {
          this.isLoading = false;
        }
      } else {
        this.isValidToken = false;
        this.isLoading = false;
      }
    },
    methods: {
      goToResetPassword() {
        if (this.isValidToken) {
          this.$router.push({
            path: '/update-password',  // 실제 비밀번호 재설정 페이지로 이동
            query: { token: this.token } // 필요하면 토큰을 쿼리 파라미터로 전달
          });
        } else {
          alert('유효하지 않은 토큰입니다.');
        }
      }
    }
  };
  </script>
  