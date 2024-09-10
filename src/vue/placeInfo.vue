<template>
  <div id="placeInfo" class="container">
    <div v-if="place">
      <h1>{{ place.name }}</h1>
      <div class="content">
        <div class="place-image">
           <!-- 이미지가 있을 때는 해당 이미지 사용, 없으면 placeType에 따라 기본 이미지 사용 -->
          <img :src="getImageUrl(place.image)" alt="placeImage" v-if="place.image" />
          <img v-else :src="getDefaultImageUrl(place.placeType)" alt="defaultImage" />
          <!--<img v-else src="../image/placePic/아동서점_1.jpg" alt="defaultImage" />-->
          <!-- <img v-else :src="require(`@/assets/${getDefaultImageFileName(place.placeType)}`)" alt="defaultImage" /> -->
        </div>
        <div class="place-details">
          <p>{{place.placeType}}</p>
          <p>{{ place.address ? `주소 : ${place.address}` : '주소 정보가 없습니다'}}</p>
          <p>📞{{ place.tel ? `전화번호: ${place.tel}` : '전화번호 정보가 없습니다' }}</p>
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
        
          <p>{{ place.description ? `장소 설명 : ${place.description}` : '장소 정보가 없습니다'}}</p>
          <p>{{ place.entranceFee ? `입장료 : ${place.entranceFee}` : '입장료가 따로 없습니다'}}</p>
          <p>{{ place.operationTime ? `운영시간 : ${place.operationTime}` : '운영시간 정보가 없습니다'}}</p>
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
      // Vue Router를 사용할 경우, this.$route.query를 통해 쿼리 파라미터를 직접 읽을 수 있습니다.
      const no = this.$route.query.placeNo; // 쿼리 파라미터에서 placeNo 추출
      console.log("Extracted no: ", no); // no가 올바르게 추출되었는지 확인

      // placeNo가 존재하는 경우에만 API 요청을 보냅니다.
      if (no) {
      axios
        .get(`http://localhost:8080/places/${no}`)
        .then((res) => {
          console.log("Server response:", res.data); // 서버 응답 확인
          this.place = res.data;
        })
        .catch((err) => {
          console.log("장소 정보: ", err);
        });
      } else {
        console.log("No place number provided in the URL."); // placeNo가 없는 경우의 처리
      }
    },
    getImageUrl(imagePath) {
      //서버의 url과 이미지 경로를 조합하여  전체 URL을 만듦.
      return imagePath ? `http://localhost:8080/${imagePath}` : '';
    },
    getDefaultImageUrl(placeType) {
      // 장소 유형에 따라 다른 기본 이미지 URL 설정
      const defaultImageUrls = {
        restaurant: 'http://localhost:8080/images/default-restaurant.jpg',
        cafe: 'http://localhost:8080/images/default-cafe.jpg',
        tourist: 'http://localhost:8080/images/default-tourist.jpg',
        // 추가 기본 이미지 유형 설정
      };
      
      // placeType에 따른 기본 이미지 URL 반환
      return defaultImageUrls[placeType] || 'http://localhost:8080/images/default.jpg';
    },
  },
  mounted() {
    this.showInfo(); //페이지가 로드될때 showInfo()를 호출(버튼x)
  },
};
</script>
