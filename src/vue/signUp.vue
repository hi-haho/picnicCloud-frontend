<template>
    <div id="signup-page">
      <div class="signup-container">
        <h1 class="signup-title">회원가입</h1>
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
              type="email" 
              v-model="email" 
              placeholder="이메일" 
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
          <div class="input-group">
            <input 
              type="password" 
              v-model="confirmPassword" 
              placeholder="비밀번호 확인" 
              required 
            />
          </div>
          <button type="submit" class="signup-button">회원가입</button>
        </form>
        <div class="links">
          <a href="#">이미 계정이 있으신가요? 로그인</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Signup",
    data() {
      return {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
    },
    methods: {
      handleSubmit() {
        // 회원가입 버튼 클릭 시 실행될 로직
        if (this.password !== this.confirmPassword) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }
        console.log("회원가입 시도", this.username, this.email, this.password);
      },
    },
  };
  </script>

<style src="../css/signUp.css"></style>
  