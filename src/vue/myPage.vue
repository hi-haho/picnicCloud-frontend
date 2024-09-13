<template>
  <div id="myPageMain">
    <div id="buttonArea">
      <router-link to="/myPage" exact-active-class="active-link">내 정보</router-link>
      <router-link to="/myPosts" exact-active-class="active-link">내 게시글</router-link>
      <router-link to="/myLikes" exact-active-class="active-link">내 찜</router-link>
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
        <button @click="closePasswordChangeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import apiClient from "@/api/api";
import { toast } from "vue3-toastify"; // toast 함수 임포트
import "vue3-toastify/dist/index.css"; // 토스트 스타일 임포트
import "@/css/myPage.css";

export default {
  data() {
    return {
      user: {
        id: "",
        email: "",
        address: "",
        childAge: "",
      },
      showPasswordChangeModal: false,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]),

    async updateUserInfo() {
      try {
        const userDetailDto = {
          email: this.user.email,
          address: this.user.address,
          childAge: this.user.childAge,
        };

        const userDto = {}; // 필요한 경우 userDto를 추가로 설정합니다.

        const response = await apiClient.put("/mypage/updateinfo", {
          userDto,
          userDetailDto,
        });

        if (response.status === 200) {
          toast.success("정보가 성공적으로 수정되었습니다.");
        } else {
          toast.error("정보 수정에 실패했습니다.");
        }
      } catch (error) {
        console.error("정보 수정 오류:", error);
        toast.error("정보 수정에 실패했습니다.");
      }
    },

    openPasswordChangeModal() {
      this.showPasswordChangeModal = true;
    },
    closePasswordChangeModal() {
      this.showPasswordChangeModal = false;
      // 입력 필드 값 초기화
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    },

    async changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        toast.error("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      try {
        const response = await apiClient.post("/mypage/change-password", {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword,
        });

        if (response.status === 200) {
          toast.success("비밀번호가 성공적으로 변경되었습니다.");
          this.closePasswordChangeModal(); // 모달 닫기 및 필드 초기화
        } else {
          toast.error("비밀번호 변경에 실패했습니다.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data || "비밀번호 변경에 실패했습니다.";
        toast.error(errorMessage);
      }
    },
  },
  async created() {
    try {
      const response = await apiClient.get("/mypage/myinfo");
      this.user = response.data; // 서버에서 가져온 사용자 정보를 Vue 컴포넌트의 데이터로 설정합니다.
    } catch (error) {
      console.error("유저 정보 가져오기 오류:", error);
      toast.error("유저 정보를 가져오는 데 실패했습니다.");
    }
  },
  mounted() {},
};
</script>
