<template>
  <div id="fleamarket">
    <section id="searchSection">
      <div class="search-wrapper">
        <!-- 카테고리 선택 -->
        <select v-model="category">
          <option value="0">전체</option>
          <option v-for="cat in categories" :key="cat.no" :value="cat.no">
            {{ cat.categoryName }}
          </option>
        </select>

        <!-- 검색창 -->
        <input
          type="text"
          v-model="search"
          placeholder="상품명 혹은 설명"
          class="search-input"
          @keyup.enter="searchAndFilter"
        />
        <div class="searchButton">
        <button @click="searchAndFilter">
          <img src="@/image/navIcon/search.png" alt="검색">
        </button>
      </div>
      </div>
    </section>

    <!-- 글쓰기 버튼 -->
    <div v-if="isLoggedIn" class="button">
      <button @click="create">글쓰기</button>
    </div>

    <!-- 게시판 리스트 -->
    <div>
      <div v-if="content.length > 0">
        <div class="post-container">
          <div
            v-for="(item, index) in content"
            :key="index"
            class="onedata"
          >
            <router-link
              :to="{ name: 'FleaMarketDetail', params: { no: item.no } }"
              class="oneItem"
            >
              <span class="image">
                <!-- 첫 번째 이미지 파일만 표시 -->
                <img
                  :src="getImagePath(item.files[0])"
                  alt="이미지 설명"
                  class="thumbnail"
                />
              </span>
              <span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.contents }}</p>
                <p><b>{{ item.price }} 원</b></p>
                <p>{{ formatDate(item.createdate) }}</p>
                <p>❤️ {{ item.favoriteCnt }}</p>
                <p><b>카테고리: {{ item.categoryName }}</b></p>
              </span>
            </router-link>
          </div>
        </div>
      </div>

      <div v-else>
        <h2>게시글이 없습니다. 새글을 작성해보세요!</h2>
      </div>

      <!-- Pagination Controls -->
      <div v-if="page && page.totalPages > 1" class="pagination">
        <button
          @click="changePage(page.number - 1)"
          :disabled="page.number === 0"
        >
          이전
        </button>
        <button
          v-for="pageNum in paginationPages"
          :key="pageNum"
          @click="changePage(pageNum)"
          :class="{ active: pageNum === page.number }"
        >
          {{ pageNum + 1 }}
        </button>
        <button
          @click="changePage(page.number + 1)"
          :disabled="page.number === page.totalPages - 1"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/api';
import { getUserIdFromToken } from '@/utils/auth'; // 유틸리티 함수 가져오기
import { toast } from 'vue3-toastify'; // toast 함수 임포트
import 'vue3-toastify/dist/index.css'; // 토스트 스타일 임포트
import '@/css/fleamarket.css';

export default {
  name: 'FleaMarketMain',
  setup() {
    const content = ref([]);
    const categories = ref([]);
    const category = ref(0); // 선택된 카테고리
    const search = ref('');
    const router = useRouter();
    const page = ref({
      size: 0,
      number: 0,
      totalElements: 0,
      totalPages: 1,
    });
    const pageNumber = ref(0); // 현재 페이지 번호
    const size = ref(9); // 페이지당 아이템 수
    const isLoggedIn = ref(false);

    // 로그인 상태 확인
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      isLoggedIn.value = !!token;
    };

    // 카테고리와 검색어를 함께 적용하여 게시글 가져오기
    const searchAndFilter = async () => {
      try {
        const categoryParam = category.value === 0 ? 0 : category.value;
        const url = `/fleaMarket?page=${pageNumber.value}&size=${size.value}&category=${categoryParam}&search=${encodeURIComponent(
          search.value
        )}&sort=createdate,desc`; // 최신 글을 먼저 불러오도록 정렬
        const response = await apiClient.get(url);
        content.value = response.data.content;
        page.value = response.data.page;
      } catch (err) {
        console.error('fleaMain Fetch error:', err);
      }
    };

    // 카테고리 가져오기
    const Axioscategories = async () => {
      try {
        const response = await apiClient.get('/categories');
        categories.value = response.data.map(cat => ({
          no: Number(cat.no),
          categoryName: cat.categoryName
        }));
      } catch (err) {
        console.error('Category Axios error: ', err);
      }
    };

    const changePage = (newPageNumber) => {
      if (newPageNumber >= 0 && newPageNumber < page.value.totalPages) {
        pageNumber.value = newPageNumber;
        searchAndFilter(); // 페이지 변경 시에도 카테고리와 검색어 필터를 적용하여 불러오기
      }
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    const getImagePath = (file) => {
      return file ? `http://localhost:8080/image/flea/${file.split('/').pop()}` : ''; // 파일 경로를 절대 경로로 변환
    };

    const create = () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
        router.push('/login'); // 로그인 페이지로 이동
        return;
      }
      router.push('/fleaMarketCreate');
    };

    const paginationPages = computed(() => {
      const range = 2;
      const start = Math.max(0, page.value.number - range);
      const end = Math.min(page.value.totalPages - 1, page.value.number + range);
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });

    onMounted(() => {
      checkLoginStatus();
      Axioscategories();
      searchAndFilter(); // 초기 화면 로드시에도 카테고리와 검색어 필터를 적용하여 게시글 불러오기
    });

    return {
      content,
      categories,
      category,
      search,
      page,
      pageNumber,
      size,
      searchAndFilter,
      getImagePath,
      changePage,
      formatDate,
      create,
      Axioscategories,
      paginationPages,
      isLoggedIn,
    };
  },
};
</script>
