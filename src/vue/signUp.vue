<template>
  <div id="signup-page">
    <div class="signup-container">
      <h1 class="signup-title">회원가입</h1>
      <form @submit.prevent="handleSubmit">
        <!--아이디 입력-->
        <div class="input-group">
          <input 
            type="text" 
            v-model="username" 
            placeholder="아이디" 
            required 
          />
        </div>
        <!--이름 입력-->
        <div class="input-group">
          <input 
            type="text" 
            v-model="name" 
            placeholder="이름" 
            required 
          />
        </div>
        <!--이메일 입력-->
        <div class="input-group">
          <input 
            type="email" 
            v-model="email" 
            placeholder="이메일" 
            required 
          />
        </div>
        <!--비번 입력-->
        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="비밀번호" 
            required 
          />
        </div>
         <!--비번 재입력-->
        <div class="input-group">
          <input 
            type="password" 
            v-model="confirmPassword" 
            placeholder="비밀번호 확인" 
            required 
          />
        </div>
        
        <!-- 선택사항 -->
         <h3>선택사항</h3><br>
          <!--주소 입력-->
        <div class="input-group">
          <input 
            type="text" 
            v-model="address" 
            placeholder="주소 (선택 사항)" 
          />
        </div>
         <!--성별 입력-->
        <div class="input-group">
          <div class="gender-options">
            <label>남성</label>
            <label>
              <input 
                type="radio" 
                v-model="gender" 
                value="male" 
              />
            </label>
            <label>여성</label>
            <label>
              <input 
                type="radio" 
                v-model="gender" 
                value="female" 
              />
            </label>
          </div>
        </div>
         <!--자녀 나이 입력-->
        <div class="input-group">
          <input 
            type="number" 
            v-model="childrenAge" 
            placeholder="자녀 나이 (선택 사항)" 
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
import apiClient from '@/api/api'; 

export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",         
      gender: "",          
      childrenAge: null,   
    };
  },
  methods: {
    async handleSubmit() {
      // 필수 입력 값 확인
      if (!this.username || !this.name || !this.email || !this.password || !this.confirmPassword) {
        alert("모든 필수 필드를 입력해주세요.");
        return;
      }
      
      // 비밀번호 확인
      if (this.password !== this.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      // 서버에 보내기 위한 회원가입 데이터 구성
      const signupData = {
        username: this.username,
        name: this.name,
        email: this.email,
        password: this.password,
        address: this.address || null, // 선택 사항이므로 null 허용
        gender: this.gender || null,   // 선택 사항
        childrenAge: this.childrenAge || null // 선택 사항
      };

      try {
        // 회원가입 API 요청
        const response = await apiClient.post('/auth/signup', signupData); // apiClient 사용
        
        if (response.data.success) {
          alert('회원가입이 성공적으로 완료되었습니다!');
          // 추가 로직: 로그인 페이지로 이동하거나 다른 작업
          this.$router.push('/login'); // 예: 로그인 페이지로 이동
        } else {
          alert('회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    },
  },
};
</script>

<style src="../css/signUp.css"></style>
