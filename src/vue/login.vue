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
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Login",
    data() {
      return {
        username: "",
        password: "",
      };
    },
    methods: {
      handleSubmit() {
        // 로그인 버튼 클릭 시 실행될 로직
        console.log("로그인 시도", this.username, this.password);
      },
    },
  };
  </script>
  
  <style src="../css/login.css"></style>