<template>
  <div id="placeInfo" class="container">
    <div v-if="place">
      <h1>{{ place.name }}</h1>
      <div class="content">
        <div class="place-image">
          <img :src="getImageUrl(place.image)" alt="placeImage" />
        </div>
        <div class="place-details">
          <p>{{ place.address }}</p>
          <p>📞{{ place.tel }}</p>
          <p>⭐{{ place.point.toFixed(1) }}</p>
          <p>🖤🤍{{ place.like }} {{ place.likeCnt }}</p>
          <!-- 좋아요 토글처리 -->
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
          <!--리뷰수 ajax-->
        </li>
      </ul>
      <!-- 탭 내용 -->
      <div class="tab-content">
        <div
          id="tab1"
          class="tab-pane"
          :class="{ active: activeTab === 'tab1' }"
        >
          <p>{{ place.description }}</p>
          <p>{{ place.entranceFee }}</p>
          <p>{{ place.operationTime }}</p>
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
      //초기화
      place: null,
      activeTab: "tab1", // 현재 활성화된 탭을 관리하는 상태 변수 추가
    };
  },
  methods: {
    showInfo() {
      //현재 페이지의 URL에서 쿼리스트링 부분을 가져옴(동적 데이터로딩)
      const urlParams = new URLSearchParams(window.location.search); //파싱할수있는객체생성. //?pNo=3
      const no = urlParams.get("no"); //객체에서 매개변수 값 추출 //3

      axios
        .get(`http://localhost:8080/places/${no}`)
        .then((res) => {
          this.place = res.data;
        })
        .catch((err) => {
          console.log("장소 정보: ", err);
        });
    },
    getImageUrl(imagePath) {
      //서버의 url과 이미지 경로를 조합하여  전체 URL을 만듦.
      return `http://localhost:8080/${imagePath}`;
    },
  },
  mounted() {
    this.showInfo(); //페이지가 로드될때 showInfo()를 호출(버튼x)
  },
};
</script>
