<template>
  <div id="placeInfo" class="container">
    <!-- 장소 기본설명 -->
    <div v-if="place">
      <h1>{{ place.name }}</h1>
      <div class="content">
        <div class="place-image">
          <img
            v-if="place.image"
            :src="getImageUrl(place.image)"
            alt="placeImage"
          />
          <div v-else>
            <img
              :src="getDefaultImageUrl(place.placeType)"
              alt="defaultImage"
              v-if="getDefaultImageUrl(place.placeType)"
            />
            <!-- 기본 이미지도 없을 경우 텍스트 표시 -->
            <p v-else>해당 장소 유형에 대한 이미지가 없습니다</p>
          </div>
        </div>
        <!-- 장소 세부 정보 -->
        <div class="place-details">
          <p>{{ place.placeType }}</p>
          <p>
            {{
              place.address ? `주소 : ${place.address}` : "주소 정보가 없습니다"
            }}
          </p>
          <p>
            📞
            {{
              place.tel ? `전화번호: ${place.tel}` : "전화번호 정보가 없습니다"
            }}
          </p>
          <p>⭐{{ place.point.toFixed(1) }}</p>
          <!-- 좋아요 버튼 -->
          <p>
            <button @click="toggleLike" class="like-button">
              <span>{{ userHasLiked ? "❤️" : "🩶" }}</span>
            </button>
            {{ userHasLiked ? "좋아요 취소" : "좋아요" }} ({{ placelikeCount }})
          </p>
        </div>
      </div>

      <!-- 탭 버튼 -->
      <ul class="tabs">
        <!-- 첫 번째 탭: 상세 정보 -->
        <li
          class="tab-button"
          :class="{ active: activeTab === 'tab1' }"
          @click="activeTab = 'tab1'"
        >
          상세정보
        </li>
        <!-- 두 번째 탭: 리뷰 -->
        <li
          class="tab-button"
          :class="{ active: activeTab === 'tab2' }"
          @click="activeTab = 'tab2'"
        >
          리뷰
        </li>
      </ul>

      <!-- 탭 내용 -->
      <div class="tab-content">
        <!-- 첫 번째 탭 내용: 장소 상세 정보 -->
        <div
          id="tab1"
          class="tab-pane"
          :class="{ active: activeTab === 'tab1' }"
        >
          <p>
            <span class="bold-text">장소 설명</span><br />
            {{ place.description ? place.description : "추가 정보가 없습니다" }}
          </p>
          <br />
          <p>
            <span class="bold-text">입장료</span><br />
            {{
              place.entranceFee ? place.entranceFee : "입장료 정보가 없습니다"
            }}
          </p>
          <br />
          <p>
            <span class="bold-text">운영시간</span><br />
            {{
              place.operationTime
                ? place.operationTime
                : "운영시간 정보가 없습니다"
            }}
          </p>
        </div>

        <!-- 두 번째 탭 내용: 리뷰 -->
        <div
          id="tab2"
          class="tab-pane"
          :class="{ active: activeTab === 'tab2' }"
        >
          <!-- 별점 입력 -->
          <div class="rating">
            <span
              v-for="n in 5"
              :key="n"
              @click="setRating(n)"
              @mouseover="onStarHover(n)"
              @mouseleave="resetRating"
              :class="{
                star: true,
                active: n <= currentRating || n <= hoverRating,
              }"
            >
              ★
            </span>
          </div>

          <!-- 리뷰 텍스트 입력 -->
          <textarea
            v-model="reviewText"
            placeholder="해당 장소에 대한 리뷰를 300자이내로 작성해주세요"
            rows="5"
            cols="50"
            maxlength="300"
            class="review-textarea"
          ></textarea>
          <br />

          <!-- 리뷰 제출 버튼 -->
          <button @click="submitReview" class="submit-button">리뷰 제출</button>
          <br /><br />

          <!-- 리뷰 목록 -->
          <div v-if="reviews && reviews.length">
            <p>리뷰목록</p>
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <p>
                <strong>{{ review.userId }}</strong> - {{ review.rating }}⭐
              </p>
              <p>{{ review.text }}</p>
              <p>
                <small>
                  작성일: {{ new Date(review.createDate).toLocaleDateString() }}
                </small>
              </p>

              <!-- 리뷰 수정 및 삭제 버튼 (작성자만 표시) -->
              <button
                v-if="review.userId === userId"
                @click="editReview(review)"
                class="edit-button"
              >
                수정
              </button>
              <button
                v-if="review.userId === userId"
                @click="deleteReview(review.id)"
                class="delete-button"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 장소 정보가 없는 경우 메시지 표시 -->
    <div v-else>
      <p>해당 번호의 장소는 존재하지 않습니다</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../css/placeInfo.css";
export default {
  name: "PlaceInfo",
  data() {
    return {
      place: null,
      activeTab: "tab1",
      placelikeCount: 0,
      userHasLiked: false, // 사용자 좋아요 상태를 관리
      currentRating: 0, // 현재 선택된 별점
      hoverRating: 0, // 마우스 오버 시 별점
      reviewText: "", // 리뷰 텍스트를 저장할 데이터 속성
      reviews: [], // Initialize as an empty array
      token: localStorage.getItem("token"), // 사용자 로그인 여부 확인
    };
  },
  methods: {
    // 장소 정보 및 좋아요 상태 초기화
    showInfo() {
      const no = this.$route.query.placeNo;
      if (no) {
        axios
          .get(`http://localhost:8080/places/${no}`)
          .then((res) => {
            this.place = res.data;
            // 좋아요 수를 가져오는 메서드 호출
            this.fetchPlaceLikeCount(no);
            // 사용자가 좋아요를 눌렀는지 확인하는 메서드 호출
            this.checkUserLikeStatus(no);
          })
          .catch((err) => {
            console.log("장소 정보: ", err);
          });
      } else {
        console.log("No place number provided in the URL.");
      }
    },
    // 장소 좋아요 수 가져오기
    fetchPlaceLikeCount(placeNo) {
      axios
        .get(`http://localhost:8080/places/${placeNo}/likes-count`)
        .then((res) => {
          this.placelikeCount = res.data;
        })
        .catch((err) => {
          console.log("좋아요 수 가져오기 오류: ", err);
        });
    },
    // 장소 좋아요 상태 확인 및 토글 처리
    checkLikeStatus() {
      if (!this.place || !this.place.placeNo) return;
      axios
        .post(
          `http://localhost:8080/places/${this.place.placeNo}/likes-toggle`,
          null,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((res) => {
          this.userHasLiked = res.data.liked; // 서버가 반환하는 값에 맞춰 처리
          this.placelikeCount = res.data.likeCount; // 서버에서 업데이트된 좋아요 수를 받음
        })
        .catch((err) => {
          console.log("좋아요 상태 확인 오류: ", err);
        });
    },

    // 장소좋아요 버튼 클릭
    toggleLike() {
      if (!this.token) {
        alert("로그인이 필요합니다.");
        this.$router.push({ name: "Login" }); // 로그인 페이지로 리다이렉트
        return;
      }

      if (!this.place || !this.place.placeNo) return;

      axios
        .post(
          `http://localhost:8080/places/${this.place.placeNo}/likes-toggle`,
          null,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((res) => {
          this.userHasLiked = res.data.liked; // 좋아요 상태 토글
          this.placelikeCount = res.data.likeCount; // 좋아요 수 업데이트
        })
        .catch((err) => {
          console.log("좋아요 토글 오류: ", err);
        });
    },

    // 장소 이미지관리
    getImageUrl(imagePath) {
      return imagePath ? `http://localhost:8080/${imagePath}` : "";
    },
    getDefaultImageUrl(placeType) {
      const defaultImageUrls = {
        "공공형 키즈카페": require("@/image/placePic/공공형 키즈카페_1.jpg"),
        아동서점: require("@/image/placePic/아동서점_1.jpg"),
        자연휴양림: require("@/image/placePic/자연휴양림_1.jpg"),
        캠핑: require("@/image/placePic/캠핑_1.jpg"),
      };
      return defaultImageUrls[placeType] || "";
    },

    //리뷰 별점
    setRating(rating) {
      this.currentRating = rating;
    },
    onStarHover(rating) {
      this.hoverRating = rating;
    },
    resetRating() {
      this.hoverRating = 0;
    },

    //리뷰 조회
    fetchReviews(placeNo) {
      axios
        .get(`http://localhost:8080/reviews/${placeNo}`, {
          params: {
            page: 0,
            size: 10,
          },
        })
        .then((res) => {
          this.reviews = res.data.content || []; // Ensure reviews is always an array
        })
        .catch((err) => {
          console.log("리뷰 목록 가져오기 오류: ", err);
          this.reviews = []; // Set reviews to an empty array in case of error
        });
    },
    //리뷰생성

    //리뷰수정

    //리뷰삭제
  },
  mounted() {
    this.showInfo();
  },
};
</script>
