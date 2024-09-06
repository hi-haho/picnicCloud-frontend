<template>
  <div id="myPageMain">
    <div id="buttonArea">
      <router-link to="/myPage">내 정보</router-link>
      <router-link to="/myPosts">내 게시글</router-link>
      <router-link to="/myLikes">내 찜</router-link>
    </div>
    <div id="contentsArea">
      <h3>내 정보</h3>
      아이디 <input type="text" v-model="user.id" readonly /> <br /><br />
      이메일주소 <input type="email" v-model="user.email" /><br /><br />
      주소 <input type="text" v-model="user.address" /><br /><br />
      자녀 나이 <input type="text" v-model="user.childAge" /><br /><br />
      <button @click="updateUserInfo">수정</button>

      <!-- 비밀번호 변경 버튼 -->
      <button @click="openPasswordChangeModal">비밀번호 변경</button>
    </div>

    <!-- 비밀번호 변경 모달 -->
    <div v-if="showPasswordChangeModal" class="modal">
      <div class="modal-content">
        <h3>비밀번호 변경</h3>
        <label for="currentPassword">현재 비밀번호</label>
        <input
          type="password"
          v-model="currentPassword"
          id="currentPassword"
        /><br /><br />
        <label for="newPassword">새 비밀번호</label><br />
        <input
          type="password"
          v-model="newPassword"
          id="newPassword"
        /><br /><br />
        <label for="confirmPassword">새 비밀번호 확인</label>
        <input
          type="password"
          v-model="confirmPassword"
          id="confirmPassword"
        /><br /><br />
        <button @click="changePassword">변경</button>
        <button @click="showPasswordChangeModal = false">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/api/api";
import "@/css/myPage.css"; // 분리된 CSS 파일 불러오기

export default {
  data() {
    return {
      user: {
        id: "",
        email: "",
        address: "",
        childAge: "",
      },
      showPasswordChangeModal: false, // 비밀번호 변경 모달 표시 여부
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  methods: {
    fetchUserInfo() {
      const userNo = 2; // 임시로 userNo를 2로 설정. 이 부분에 jwt 토큰을 이용해서 Vuex에 저장했던 no값을 넣어줘야 하는 코드 추가 필요!

      apiClient
        .get(`/mypage/myinfo`, {
          params: {
            no: userNo,
          },
        })
        .then((response) => {
          this.user = response.data; // 가져온 사용자 정보를 `user`에 저장
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    },
    updateUserInfo() {
      const userNo = 2; // 임시로 userNo를 2로 설정

      apiClient
        .put(
          `/mypage/updateinfo`,
          {
            userDto: {
              name: this.user.name, // 이름을 업데이트할 경우
            },
            userDetailDto: {
              email: this.user.email,
              address: this.user.address,
              childAge: this.user.childAge,
            },
          },
          {
            params: { no: userNo }, // 사용자 ID 전달
          }
        )
        .then((response) => {
          console.log(response);
          alert("사용자 정보가 성공적으로 수정되었습니다.");
        })
        .catch((error) => {
          alert("사용자 정보 수정 중 오류가 발생했습니다.");
          console.error(error);
        });
    },
    changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }

      const userNo = 5; // 임시로 userNo를 5로 설정

      apiClient
        .post(
          "/mypage/change-password",
          {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
          },
          {
            params: { no: userNo }, // 사용자 ID를 명시적으로 전달
          }
        )
        .then((response) => {
          console.log(response);
          alert("비밀번호가 성공적으로 변경되었습니다.");
          this.showPasswordChangeModal = false;
        })
        .catch((error) => {
          alert("비밀번호 변경 중 오류가 발생했습니다.");
          console.error(error);
        });
    },
    openPasswordChangeModal() {
      // 모달을 열 때 입력 필드를 초기화
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
      this.showPasswordChangeModal = true; // 모달을 열기
    },
  },
  mounted() {
    this.fetchUserInfo(); // 페이지 로드 시 사용자 정보 가져오기
  },
};
</script>
