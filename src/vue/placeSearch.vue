<template>
  <div id="placeSearch">
    <div class="search-bar">
      <input
        type="text"
        id="search"
        class="search"
        v-model="keyword"
        placeholder="시설명 혹은 주소 검색"
        @keydown.enter="searchFunc"
      />
      <button @click="searchFunc">
        <img src="@/image/navIcon/search.png" alt="검색" />
      </button>
    </div>

    <!-- 로딩 중일 때 표시 -->
    <div v-if="loading" class="loading">
      <p>로딩 중입니다... ⏳</p>
    </div>

    <!-- 로딩이 완료되고 결과가 있을 때 표시 -->
    <div v-else-if="totalResults > 0">
      <p>총 {{ totalResults }}개의 장소</p>
      <div v-for="(p, index) in places" :key="index" class="place-item">
        <router-link :to="{ path: '/placeInfo', query: { placeNo: p.no } }">
          <div class="place-image">
            <!-- 각 정보마다 반복적으로 5장의 이미지 사용 -->
            <img :src="getImageUrl(p.placeType, index)" alt="placeImage" />
          </div>
          <div class="place-info">
            <h3>{{ p.name }}</h3>
            <p>
              {{ p.address ? `주소: ${p.address}` : "주소 정보가 없습니다" }}
            </p>
            <p>
              {{ p.tel ? `📞${p.tel}` : "📞 전화번호 정보가 없습니다" }}
            </p>
            <p>⭐{{ p.point.toFixed(1) }} 💛{{ p.likeCnt }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 결과가 없을 때 표시 -->
    <div v-else>
      <p>결과가 없어요</p>
    </div>

    <!-- 페이징 버튼 추가 -->
    <div v-if="totalPages > 1" class="pagination">
      <a
        href="javascript:void(0)"
        @click="changePage(currentPage - 1)"
        :class="{ disabled: currentPage === 0 }"
        >&lt;</a
      >
      <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
      <a
        href="javascript:void(0)"
        @click="changePage(currentPage + 1)"
        :class="{ disabled: currentPage === totalPages - 1 }"
        >&gt;</a
      >
    </div>
  </div>
</template>

<script>
import "../css/placeSearch.css";
import apiClient from "@/api/api.js";
import { getUserIdFromToken } from "@/utils/auth";

export default {
  name: "placeSearch",
  data() {
    return {
      places: [],
      keyword: "",
      currentPage: 0, // 현재 페이지 번호
      totalPages: 1, // 총 페이지 수
      totalResults: 0, // 전체 검색 결과 수
      loading: false, // 로딩 상태를 위한 변수 추가
    };
  },
  methods: {
    axiosData(keyword = "", page = 0, size = 10) {
      this.loading = true; // 로딩 시작
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.substring(hash.indexOf("?")));
      const placeType = urlParams.get("placeType");
      const userId = getUserIdFromToken();

      // placeType을 URL로 인코딩하여 공백이나 한글 처리
      const encodedPlaceType = encodeURIComponent(placeType);

      // userId가 null일 경우에는 userId 파라미터를 추가하지 않음
      let query = `/places?placeType=${encodedPlaceType}&page=${page}&size=${size}`;
      if (userId) {
        query += `&userId=${userId}`;
      }
      if (keyword) {
        query += `&keyword=${encodeURIComponent(keyword)}`;
      }

      apiClient
        .get(query)
        .then((res) => {
          this.places = res.data.content;
          this.totalPages = res.data.page.totalPages; // 응답에서 페이지 정보 추출
          this.currentPage = res.data.page.number; // 현재 페이지 정보 추출
          this.totalResults = res.data.page.totalElements; // 총 결과 수 업데이트
          this.loading = false; // 로딩 완료
        })
        .catch((err) => {
          console.error("장소출력 오류: ", err);
          this.loading = false; // 오류 발생 시에도 로딩 상태 종료
        });
    },

    changePage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.axiosData(this.keyword, page);
      }
    },

    searchFunc() {
      this.currentPage = 0; // 검색 시 첫 페이지로 초기화
      this.axiosData(this.keyword, this.currentPage);

      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.substring(hash.indexOf("?")));

      if (this.keyword) {
        urlParams.set("keyword", this.keyword);
      } else {
        urlParams.delete("keyword");
      }

      // URL 갱신
      const newUrl = `${window.location.pathname}#${
        window.location.hash.split("?")[0]
      }?${urlParams.toString()}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    },

    getImageUrl(placeType, index) {
      // 5장의 이미지를 반복적으로 사용
      const imageIndex = (index % 5) + 1; // 1부터 5까지 순환
      return require(`../image/placePic/${placeType}_${imageIndex}.jpg`);
    },
  },
  mounted() {
    this.axiosData();
  },
};
</script>
