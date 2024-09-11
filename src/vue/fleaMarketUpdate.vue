<template>
  <div id="update">
    <button @click="cancel">취소</button>
    <form @submit.prevent="update" method="post" enctype="multipart/form-data">
      <span>
        제목 :
        <input type="text" name="title" v-model="datas.title" />
        <br />
      </span>
      <span>
        가격 :
        <input type="text" name="price" v-model="datas.price" />
        <br />
      </span>
      <span>
        설명 :
        <textarea name="contents" v-model="datas.contents"></textarea>
        <br />
      </span>
      <span>
        <!-- 카테고리 선택 -->
        <select v-model="datas.categoryNo">
          <option v-for="cat in categories" :key="cat.no" :value="cat.no">
            {{ cat.categoryName }}
          </option>
          <option value="0">전체</option>
        </select>
        <br />
      </span>
      <span>
        첨부파일 :
        <input type="file" name="file" />
        <br />
      </span>
      <input type="submit" value="업로드" />
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api/api.js';

export default {
  name: 'fleaMarketUpdate',
  setup() {
    const route = useRoute(); // URL의 경로 파라미터에 접근
    const router = useRouter();
    const categories = ref([]);
    const datas = ref({
      title: '',
      price: '',
      contents: '',
      categoryNo: 0
    });
    const no = ref(route.params.no); // URL 파라미터에서 'no' 값을 가져옵니다.

    const AxiosCategories = async () => {
      try {
        const response = await apiClient.get('/categories');
        categories.value = response.data;
      } catch (err) {
        console.error("Category Fetch error: ", err);
      }
    };

    const updateData = async () => {
      if (!no.value) {
        console.error("No parameter is missing in the URL.");
        return;
      }

      try {
        const response = await apiClient.get(`/fleaMarket/${no.value}`);
        datas.value = response.data;
      } catch (err) {
        console.error("fleaUpdate Axios Fail:", err);
      }
    };

    const update = async () => {
      if (!no.value) {
        alert("유효하지 않은 요청입니다.");
        return;
      }

      try {
        await apiClient.put(`/fleaMarket/${no.value}`, datas.value);
        if (confirm("수정하시겠습니까?")) {
          // router.push({ name: 'FleaMarketDetail', params: { no: no.value } });
        }
      } catch (err) {
        alert("수정 실패: " + err);
      }
    };

    const cancel = () => {
      if (no.value) {
        router.push({ name: 'FleaMarketDetail', params: { no: no.value } });
      } else {
        console.error("No parameter is missing in the URL.");
      }
    };

    onMounted(() => {
      updateData();
      AxiosCategories();
    });

    return {
      datas,
      categories,
      no,
      update,
      cancel
    };
  }
};
</script>
