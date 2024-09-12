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
        <button type="button" class="reset-button" @click="handleReset">아이디찾기 / 비밀번호재설정</button>

      </form>
      <div class="links">
        <router-link to="/signUp">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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
        alert('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
      }
    },
    handleReset() {
      // 아이디찾기/비밀번호 재설정 페이지로 리다이렉트
      this.$router.push('/resetIdPassword');
    },
  },
};
</script>

<style src="../css/login.css"></style>
