<template>
  <div id="login-page">
    <div class="login-container">
      <h1 class="login-title">로그인</h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input 
            type="text" 
            v-model="username" 
            placeholder="아이디" 
            required 
          />
        </div>
        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="비밀번호" 
            required 
          />
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
      <div class="links">
        <router-link to="/signUp">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify'; // toast 함수 임포트
import 'vue3-toastify/dist/index.css'; // 토스트 스타일 임포트

export default {
  name: "LogIn",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleSubmit() {
  try {
    const loginData = {
      id: this.username,
      pw: this.password,
    };

    await this.login(loginData); // Vuex 액션 호출

    // 로그인 후 페이지 리다이렉트
    this.$router.push('/');
  } catch (error) {
    console.error('로그인 실패:', error);
    if (error.response && error.response.data) {
      // 서버에서 반환한 오류 메시지를 사용
      toast.error(`로그인 실패: ${error.response.data.message || '아이디 또는 비밀번호가 잘못되었습니다.'}`);
    } else {
      // 일반적인 오류 메시지
      toast.error('로그인 실패: 서버와의 연결 문제.');
      }
    }
  }
  }
};
</script>

<style src="../css/login.css"></style>
