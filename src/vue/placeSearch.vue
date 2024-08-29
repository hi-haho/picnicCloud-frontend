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
      <!--검색 가이드 placeholder로 제시-->
      <!--버튼을 클릭할 때뿐만 아니라, 엔터 키를 눌렀을 때도 검색이 실행되도록 -->
      <button @click="searchFunc">검색</button>
    </div>
    <div v-if="places.length > 0">
      <!--조건부 렌더링-->
      <p>검색결과 : {{ places.length }}개</p>
      <div v-for="(p, index) in places" :key="index" class="place-item">
        <div class="place-image">
          <img :src="getImageUrl(p.image)" alt="placeImage" />
        </div>
        <div class="place-info">
          <h3>
            <!-- 시설명을 클릭하면 장소상세페이지로 이동해요 -->
            <router-link :to="{ path: '/placeInfo', query: { no: 'p.no' } }">
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
  </div>
</template>

<script>
import axios from "axios";
import "../css/placeSearch.css";

export default {
  name: "placeSearch",
  data() {
    return {
      //초기화
      places: [],
      keyword: "",
    };
  },
  methods: {
    axiosData(keyword = "") {
      //keyword는 기본값인 빈 문자열 ''이 되어, 카테고리만을 기준으로 데이터를 요청

      //현재 페이지의 URL에서 쿼리스트링 부분을 가져옴(동적 데이터로딩)
      const urlParams = new URLSearchParams(window.location.search); //파싱할수있는객체생성. //?pCategory=waterpark
      const placeType = urlParams.get("placeType"); //객체에서 매개변수 값 추출 //waterpark

      //카테고리 없을때. 사용자가 잘못된 URL로 접근했을 때 문제를 방지
      if (!placeType) {
        console.error("해당 테마 정보가 없습니다.");
        return;
      }

      // 기본 쿼리 URL 구성
      let query = `http://localhost/places?placeType=${placeType}`;
      //키워드가 있으면 쿼리스트링에 추가
      if (keyword) {
        query += `&keyword=${keyword}`;
      }

      // placeType에 따른 데이터 요청
      axios
        .get(query)
        .then((res) => {
          this.places = res.data;
        })
        .catch((err) => {
          console.error("장소출력 오류: ", err);
          //alert('장소 데이터를 가져오는 데 문제가 발생했습니다.');
        });
    },
    searchFunc() {
      // 키워드 값 입력후 버튼 눌렀을때 실행
      this.axiosData(this.keyword);

      // 현재 URL을 가져와서 검색어를 반영해 URL을 갱신
      //사용자가 검색어를 삭제하거나 입력하지 않은 경우, keyword 파라미터를 URL에서 제거
      const urlParams = new URLSearchParams(window.location.search);
      if (this.keyword) {
        urlParams.set("keyword", this.keyword);
      } else {
        urlParams.delete("keyword");
      }

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    },
    getImageUrl(imagePath) {
      //서버의 url과 이미지 경로를 조합하여  전체 URL을 만듦.
      return `http://localhost:80${imagePath}`;
    },
  },
  mounted() {
    this.axiosData(); // 페이지가 로드될 때 axiosData()를 호출(버튼x)
  },
};
</script>
