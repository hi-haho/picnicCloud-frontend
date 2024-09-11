<template>
  <div id="placeInfo" class="container">
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
            <p v-else>해당 장소 유형에 대한 이미지가 없습니다</p>
          </div>
        </div>
        <div class="place-details">
          <p>{{ place.placeType }}</p>
          <p>
            {{
              place.address ? `주소 : ${place.address}` : "주소 정보가 없습니다"
            }}
          </p>
          <p>
            :수화기:{{
              place.tel ? `전화번호: ${place.tel}` : "전화번호 정보가 없습니다"
            }}
          </p>
          <p>:별:{{ place.point.toFixed(1) }}</p>
          <p>
            <button @click="placetoggle" class="like-button">
              <span>{{ userHasLiked ? ':하트2:' : '🩶' }}</span>
            </button>
            {{ userHasLiked ? "좋아요 취소" : "좋아요" }} ({{ placelikeCount }})
          </p>
        </div>
      </div>
      <!-- 탭 버튼 -->
      <ul class="tabs">
        <li
          class="tab-button"
          :class="{ active: activeTab === 'tab1' }"
          @click="activeTab = 'tab1'"
        >
          상세정보
        </li>
        <li
          class="tab-button"
          :class="{ active: activeTab === 'tab2' }"
          @click="activeTab = 'tab2'"
        >
          리뷰
          <!-- 리뷰 수는 별도로 AJAX로 처리 -->
        </li>
      </ul>
      <!-- 탭 내용 -->
      <div class="tab-content">
        <div
          id="tab1"
          class="tab-pane"
          :class="{ active: activeTab === 'tab1' }"
        >
          <p>
            {{
              place.description
                ? `장소 설명 : ${place.description}`
                : "추가 정보가 없습니다"
            }}
          </p>
          <br />
          <p>
            {{
              place.entranceFee
                ? `입장료 : ${place.entranceFee}`
                : "입장료 정보가 없습니다"
            }}
          </p>
          <br />
          <p>
            {{
              place.operationTime
                ? `운영시간 : ${place.operationTime}`
                : "운영시간 정보가 없습니다"
            }}
          </p>
        </div>
        <div
          id="tab2"
          class="tab-pane"
          :class="{ active: activeTab === 'tab2' }"
        >
          <p>리뷰탭내용</p>
        </div>
      </div>
    </div>
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
    };
  },
  methods: {
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
    checkUserLikeStatus(placeNo) {
      // 사용자의 좋아요 상태를 확인하는 API 호출 필요
      // 예를 들어:
      axios
        .get(`http://localhost:8080/places/${placeNo}/user-like-status`, {
          params: { userId: "someUserId" } // 실제 사용자 ID를 넣어야 합니다
        })
        .then((res) => {
          this.userHasLiked = res.data.liked; // 서버에서 반환하는 상태에 맞춰 수정
        })
        .catch((err) => {
          console.log("사용자 좋아요 상태 가져오기 오류: ", err);
        });
    },
    getImageUrl(imagePath) {
      return imagePath ? `http://localhost:8080/${imagePath}` : "";
    },
    getDefaultImageUrl(placeType) {
      const defaultImageUrls = {
        "공공형 키즈카페": require("@/image/placePic/공공형 키즈카페_1.jpg"),
        "아동서점": require("@/image/placePic/아동서점_1.jpg"),
        "자연휴양림": require("@/image/placePic/자연휴양림_1.jpg"),
        "캠핑": require("@/image/placePic/캠핑_1.jpg"),
      };
      return defaultImageUrls[placeType] || "";
    },
    toggleLike() {
      if (!this.place || !this.place.placeNo) return;
      axios
        .post(
          `http://localhost:8080/places/${this.place.placeNo}/likes-toggle`,
          null, // POST 요청에 데이터가 필요하지 않다면 null로 설정
          {
            params: {
              userId: "someUserId", // 실제 사용자 ID를 넣어야 합니다
            }
          }
        )
        .then(() => {
          // 좋아요 상태를 토글
          this.userHasLiked = !this.userHasLiked;
          // 좋아요 수를 다시 가져와서 업데이트
          this.fetchPlaceLikeCount(this.place.placeNo);
        })
        .catch((err) => {
          console.log("좋아요 토글 오류: ", err);
        });
    },
  },
  mounted() {
    this.showInfo();
  },
};
</script>