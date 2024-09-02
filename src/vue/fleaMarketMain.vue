<template>
  <div id="fleamarket">
    <section id="searchSection">
      <!-- 카테고리 선택 -->
      <select v-model="category" @change="fetchData">
        <option v-for="cat in categories" :key="cat.no" :value="cat.no">
          {{ cat.categoryName }}
        </option>
        <option value="0">전체</option>
      </select>
      <!-- 검색창 -->
      <input type="text" v-model="search" />
      <button @click="searchbtn">검색</button>
    </section>
    <!-- 글쓰기 버튼 -->
    <div>
      <button> <router-link to="/fleaMarketCreate">글쓰기</router-link></button>
    </div>
    <!-- 게시판 -->
    <div>
      <div v-if="content.length > 0">
        <div class="post-container">
          <div v-for="(item, index) in content" :key="index" class="onedata">
            <form class="oneItem" @click="goToDetail(item.no)">
              <input type="hidden" :value="item.filePath" />
              <span>
                <!-- 첫 번째 이미지 파일만 표시 -->
                <img :src="getFirstFilePath(item.filePath)" alt="Image description" />
              </span>
              <span>{{ item.fileNo }}</span>
              <span>
                {{ item.no }}
                <h3>{{ item.title }}</h3>
                <p>{{ item.contents }}</p>
                <p><b>{{ item.price }}</b></p>
                {{ item.category }}
              </span>
            </form>
          </div>
        </div>
      </div>
      <div v-else>
        <h2>올라온 게시글이 없습니다. 새글을 적어주세요</h2>
      </div>

      <!-- Pagination Controls -->
      <div v-if="page.totalPages > 1" class="pagination">
        <button @click="changePage(page.number - 1)" :disabled="page.number === 0">Previous</button>
        <button v-for="pageNum in paginationPages" :key="pageNum" @click="changePage(pageNum)" :class="{ active: pageNum === page.number }">
          {{ pageNum + 1 }}
        </button>
        <button @click="changePage(page.number + 1)" :disabled="page.number === page.totalPages - 1">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // useRouter를 임포트합니다

export default {
  name: 'fleaMarketMain',
  setup() {
    const router = useRouter(); // router 객체를 가져옵니다
    const content = ref([]);
    const categories = ref([]);
    const category = ref(0); // 선택된 카테고리
    const search = ref("");
    const page = ref({
      size: 0,
      number: 0,
      totalElements: 0,
      totalPages: 0
    });
    const pageNumber = ref(0); // 현재 페이지 번호
    const size = ref(9); // 페이지당 아이템 수

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        categories.value = data;
      } catch (err) {
        console.error("Category Fetch error: ", err);
      }
    };

    const fetchData = async () => {
      try {
        const categoryParam = category.value === 0 ? "" : category.value;
        const url = `http://localhost:8080/fleaMarket?page=${pageNumber.value}&size=${size.value}&category=${categoryParam}&search=${encodeURIComponent(search.value)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Ajax error: " + response.statusText);
        const data = await response.json();
        content.value = data.content;
        page.value = data.page;
      } catch (err) {
        console.error("fleaMain Fetch error: ", err);
      }
    };

    const changePage = (newPageNumber) => {
      pageNumber.value = newPageNumber;
      fetchData(); // 메서드 재실행
    };

    const getFirstFilePath = (mfilePath) => {
      return Array.isArray(mfilePath) ? mfilePath[0] : mfilePath;
    };

    const goToDetail = (no) => {
      router.push({ name: 'FleaMarketDetail', query: { no } }); // router 객체를 사용하여 페이지 이동
    };

    const create = () => {
      window.location.href = `/fleamarketCreate.html`;
    };

    const searchbtn = () => {
      pageNumber.value = 0; // 검색 시 첫 페이지로 초기화
      fetchData();
    };

    const paginationPages = computed(() => {
      const range = 2; // 현재 페이지를 기준으로 보여줄 페이지 번호 범위
      const start = Math.max(0, page.value.number - range);
      const end = Math.min(page.value.totalPages - 1, page.value.number + range);
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      console.log("Pagination Pages:", pages);
      return pages;
    });

    onMounted(() => {
      fetchCategories();
      fetchData();
    });

    return {
      content,
      categories,
      category,
      search,
      page,
      pageNumber,
      size,
      fetchCategories,
      fetchData,
      changePage,
      getFirstFilePath,
      goToDetail,
      create,
      searchbtn,
      paginationPages
    };
  }
};
</script>

<style src="../css/fleamarket.css"></style>