<template>
  <div id="fleamarket">
    <!-- 공통 SearchBar 컴포넌트 사용 -->
    <SearchBar
      :searchQuery="search"
      :categories="categories"
      :selectedCategory="category"
      placeholder="상품명 혹은 설명"
      @search="searchbtn"
      @category-change="categoryChange"
    />
    
    <!-- 게시판 리스트 -->
    <div>
      <div v-if="content.length > 0">
        <div class="post-container">
          <div v-for="(item, index) in content" :key="index" class="onedata">
            <router-link :to="{ name: 'FleaMarketDetail', params: { no: item.no } }" class="oneItem">
              <img :src="getFirstFilePath(item.filePath)" alt="Image description" />
              <span>{{ item.no }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.contents }}</p>
              <p><b>{{ item.price }}</b></p>
              <p>{{ item.category }}</p>
            </router-link>
          </div>
        </div>
      </div>
      <div v-else>
        <h2>올라온 게시글이 없습니다. 새글을 적어주세요</h2>
      </div>

      <div v-if="page && page.totalPages > 1" class="pagination">
        <button @click="changePage(page.number - 1)" :disabled="page.number === 0">이전</button>
        <button v-for="pageNum in paginationPages" :key="pageNum" @click="changePage(pageNum)" :class="{ active: pageNum === page.number }">
          {{ pageNum + 1 }}
        </button>
        <button @click="changePage(page.number + 1)" :disabled="page.number === page.totalPages - 1">다음</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'; // ref, onMounted, computed를 Vue에서 임포트

export default {
  name: 'fleaMarketMain',
  
  setup() {
    const content = ref([]); // ref를 사용하여 반응형 데이터로 설정
    const categories = ref([]);
    const category = ref(0);
    const search = ref("");
    const page = ref({
      size: 0,
      number: 0,
      totalElements: 0,
      totalPages: 1,
    });
    const pageNumber = ref(0);
    const size = ref(9);

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories");
        const data = await response.json();
        categories.value = data;
      } catch (err) {
        console.error("Category Fetch error: ", err);
      }
    };

    const fetchData = async () => {
      const categoryParam = category.value === 0 ? "" : category.value;
      const url = `http://localhost:8080/fleaMarket?page=${pageNumber.value}&size=${size.value}&category=${categoryParam}&search=${encodeURIComponent(search.value)}`;
      const response = await fetch(url);
      const data = await response.json();
      content.value = data.content;
      page.value = data.page;
    };

    const categoryChange = (newCategory) => {
      category.value = newCategory;
      fetchData();
    };

    const searchbtn = () => {
      pageNumber.value = 0;
      fetchData();
    };

    onMounted(() => {
      fetchCategories();
      fetchData();
    });

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

    return {
      content,
      categories,
      category,
      search,
      page,
      pageNumber,
      paginationPages,
      fetchCategories,
      fetchData,
      searchbtn,
      categoryChange,
    };
  },
};
</script>
