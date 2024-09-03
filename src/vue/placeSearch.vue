<template>
  <div id="placeSearch">
    <div class="search-bar">
      <label for="search">검색 : </label>
      <input
        type="text"
        id="search"
        class="search"
        v-model="keyword"
        placeholder="시설명 혹은 주소"
        @keydown.enter="searchFunc"
      />
      <button @click="searchFunc">검색</button>
    </div>
    <div v-if="places.length > 0">
      <p>검색결과 : {{ places.length }}개</p>
      <div v-for="(p, index) in places" :key="index" class="place-item">
        <div class="place-image">
          <img :src="getImageUrl(p.image)" alt="placeImage" />
        </div>
        <div class="place-info">
          <h3>
            <router-link :to="{ path: '/placeInfo', query: { no: p.no } }">
              {{ p.name }}
            </router-link>
          </h3>
          <p>{{ p.address }}</p>
          <p>📞{{ p.tel }}</p>
          <p>⭐{{ p.point.toFixed(1) }} 💛{{ p.likeCnt }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>결과가 없어요</p>
    </div>

    <!-- 페이징 버튼 추가 -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0">이전</button>
      <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages - 1">다음</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../css/placeSearch.css";

export default {
  name: "placeSearch",
  data() {
    return {
      places: [],
      keyword: "",
      currentPage: 0,  // 현재 페이지 번호
      totalPages: 1,   // 총 페이지 수
    };
  },
  methods: {
    axiosData(keyword = "", page = 0) {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.substring(hash.indexOf("?")));
      const placeType = urlParams.get("placeType");

      let query = `http://localhost:8080/places?placeType=${placeType}&page=${page}`;
      if (keyword) {
        query += `&keyword=${keyword}`;
      }

      axios
        .get(query)
        .then((res) => {
          this.places = res.data.content;
          this.totalPages = res.data.totalPages;
          this.currentPage = res.data.number;
        })
        .catch((err) => {
          console.error("장소출력 오류: ", err);
        });
    },

    changePage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.axiosData(this.keyword, page);
      }
    },

    searchFunc() {
      this.currentPage = 0;  // 검색 시 첫 페이지로 초기화
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

    getImageUrl(imagePath) {
      return `http://localhost:8080${imagePath}`;
    },
  },
  mounted() {
    this.axiosData();
  },
};
</script>
