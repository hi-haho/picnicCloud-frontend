<template>
  <div id="signup-page">
    <div class="signup-container">
      <h1 class="signup-title">회원가입</h1>
      <form @submit.prevent="handleSubmit">
        <!-- 아이디 입력 -->
        <div class="input-group">
          <input 
            type="text" 
            v-model="username" 
            placeholder="아이디" 
            required 
          />
        </div>
        <!-- 이름 입력 -->
        <div class="input-group">
          <input 
            type="text" 
            v-model="name" 
            placeholder="이름" 
            required 
          />
        </div>
        <!-- 이메일 입력 -->
        <div class="input-group">
          <input 
            type="email" 
            v-model="email" 
            placeholder="이메일" 
            required 
          />
        </div>
        <!-- 비밀번호 입력 -->
        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="비밀번호" 
            required 
          />
        </div>
        <!-- 비밀번호 확인 입력 -->
        <div class="input-group">
          <input 
            type="password" 
            v-model="confirmPassword" 
            placeholder="비밀번호 확인" 
            required 
          />
        </div>
        
        <!-- 선택사항 -->
        <h3>선택사항</h3>
        <div class="input-group">
          <input 
            type="text" 
            v-model="address" 
            placeholder="주소 (선택 사항)" 
          />
        </div>
        <div class="input-group">
          <div class="gender-options">
            <span>남성</span>
            <label :class="['check', gender === 'male' ? 'active' : '']">
              <input 
                type="radio" 
                v-model="gender" 
                value="male" 
              />
            </label>
            <br>
            <span>여성</span>
            <label :class="['check', gender === 'female' ? 'active' : '']">
              <input 
                type="radio" 
                v-model="gender" 
                value="female" 
              />
            </label>
          </div>
        </div>
        <!-- 자녀 나이 입력 -->
        <div class="input-group">
          <input 
            type="number" 
            v-model="childAge" 
            placeholder="자녀 나이 (선택 사항)" 
          />
        </div>
        <!-- 제출 버튼 -->
        <button type="submit">회원가입</button>
      </form>
    </div>
  </div>
</template>

<script>
import apiClient from "@/api/api";
import { toast } from 'vue3-toastify'; // toast 함수 임포트
import 'vue3-toastify/dist/index.css'; // 토스트 스타일 임포트
import "../css/signUp.css";

export default {
  data() {
    return {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      gender: "", // "male" 또는 "female"로 설정되므로, 서버의 boolean 타입에 맞게 조정 필요
      childAge: null,
    };
  },
  methods: {
    async handleSubmit() {
      // 비밀번호 확인
      if (this.password !== this.confirmPassword) {
        toast.error("비밀번호가 일치하지 않습니다.");
        return;
      }

      // Gender를 boolean으로 변환
      const gender = this.gender === "male"; // "male"이면 true, "female"이면 false

      // 요청 데이터 구성
      const userDto = {
        id: this.username,
        pw: this.password,
        name: this.name,
      };

      const userDetailDto = {
        address: this.address,
        gender: gender, // boolean 값으로 설정
        email: this.email,
        childAge: this.childAge || 0, // null 대신 0 또는 다른 기본값 설정
      };

      try {
        // POST 요청 보내기
        await apiClient.post("/auth/signup", {
          userDto: userDto,
          userDetailDto: userDetailDto,
        });
        toast.success("회원가입이 완료되었습니다.");
        this.$router.push("/login"); // 회원가입 후 로그인 페이지로 이동
      } catch (error) {
        console.error("회원가입 실패:", error.response.data);
        toast.error("회원가입에 실패했습니다. 관리자에게 문의하세요.");
      }
    },
  },
};
</script>

