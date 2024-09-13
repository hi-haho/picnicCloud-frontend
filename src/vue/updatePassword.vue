<template>
  <div class="update-password-container">
    <h2>비밀번호 재설정</h2>
    <form @submit.prevent="submitNewPassword">
      <div class="form-group">
        <p>새 비밀번호</p>
        <input type="password" v-model="newPassword" required />
      </div>
      <div class="form-group">
        <p>비밀번호 확인</p>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <button type="submit">비밀번호 변경</button>
    </form>
  </div>
</template>

<script>
import apiClient from "@/api/api"; // Axios 인스턴스
import { toast } from 'vue3-toastify'; 

export default {
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      token: this.$route.query.token, // URL 쿼리 파라미터로 전달된 토큰 받기
    };
  },
  methods: {
    async submitNewPassword() {
      // 비밀번호 확인
      if (this.newPassword !== this.confirmPassword) {
        toast.error('비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        // 백엔드로 비밀번호 변경 요청 보내기
        const response = await apiClient.post(
          "/auth/update-password",
          {
            newPassword: this.newPassword, // request body로 비밀번호만 보냄
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              token: this.token, // 쿼리 파라미터로 token 전달
            },
          }
        );

        if (response.status === 200) {
          toast.success('비밀번호가 성공적으로 변경되었습니다.');
          this.$router.push("/login"); // 성공 후 로그인 페이지로 이동
        }
      } catch (error) {
        toast.error('비밀번호 변경에 실패했습니다.');
        console.error(error);
      }
    },
  },
};
</script>
