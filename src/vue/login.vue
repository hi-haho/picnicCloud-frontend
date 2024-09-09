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
import apiClient from '@/api/api'; // apiClient를 가져옵니다.

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

        const response = await apiClient.post('/auth/login', loginData);

        if (response.status === 200) {
          const token = response.data;
          localStorage.setItem('token', token);
          this.login(); // Vuex action 호출
          alert('로그인 성공');
          this.$router.push('/');
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert(error.response.data);
        } else {
          alert('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
        }
        console.error(error);
      }
    },
  },
};
</script>

<style src="../css/login.css"></style>
