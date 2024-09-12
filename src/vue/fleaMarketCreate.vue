<template>
  <div id="create">
    <form @submit.prevent="fleamarketInput" method="post" enctype="multipart/form-data">
      <span>
        <sup>*</sup>
        <label for="title">제목 :</label>
        <input type="text" v-model="title" name="title" id="title" />
        <span v-if="errors.title" class="error">{{ errors.title }}</span>
        <br />
      </span>
      <span>
        <sup>*</sup>
        <label for="price">가격 :</label>
        <input type="number" v-model="price" placeholder="가격을 입력하세요" />
        <span v-if="errors.price" class="error">{{ errors.price }}</span>
        <br />
      </span>
      <span>
        <sup>*</sup>
        <label for="contents">설명 :</label>
        <textarea v-model="contents" name="contents" id="contents"></textarea>
        <span v-if="errors.contents" class="error">{{ errors.contents }}</span>
        <br />
      </span>
      <span>
        <!-- 카테고리 -->
        <select v-model.number="category" @change="fetchData">
          <option v-for="cat in categories" :key="cat.no" :value="cat.no">
            {{ cat.categoryName }}
          </option>
          <option value="1">전체</option>
        </select>

        <span v-if="errors.category" class="error">{{ errors.category }}</span>
        <br />
      </span>
      <span>
        <sup>*</sup>
        <input
          type="file"
          name="mfilePath"
          id="file"
          @change="handleFileUpload"
        />
        <span v-if="errors.filePath" class="error">{{ errors.filePath }}</span>
      </span>
      <input type="submit" value="업로드" />
      <span>
        <input type="button" value="돌아가기" @click="back" />
      </span>
    </form>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import apiClient from '@/api/api';
import jwt_decode from 'jwt-decode'; // Import jwt_decode
import { useRouter } from 'vue-router';
import '@/css/fleaCreate.css';

export default {
  name: 'FleaMarketCreate',
  setup() {
    const title = ref('');
    const price = ref('');
    const contents = ref('');
    const categories = ref([]);
    const category = ref(0);
    const mfilePath = ref(null);
    const errors = ref({});
    const userid = ref('');
    const router = useRouter();

    // Function to get user ID from the JWT token
    const getUserIdFromToken = () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const decodedToken = jwt_decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          return null;
        }
        return decodedToken.sub;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };

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

    const validateForm = () => {
      errors.value = {};
      if (!title.value) errors.value.title = '제목을 입력해 주세요.';
      if (!price.value) errors.value.price = '가격을 입력해 주세요.';
      if (!contents.value) errors.value.contents = '설명을 입력해 주세요.';
      if (!category.value) errors.value.category = '카테고리를 선택해 주세요.';
      if (!mfilePath.value) errors.value.filePath = '사진을 선택해 주세요.';
      return Object.keys(errors.value).length === 0;
    };

    const fleamarketInput = async () => {
      const token = localStorage.getItem('token');
      if (!validateForm()) return;

      const formData = new FormData();
      const dto = {
        title: title.value,
        price: price.value,
        contents: contents.value,
        category: category.value,
        userId: userid.value
      };

      formData.append('dto', JSON.stringify(dto));

      if (mfilePath.value) {
        formData.append('file', mfilePath.value);
      }

      try {
        const response = await apiClient.post('/fleaMarket', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });

        console.log(response.data);
        alert('성공');
        router.push('/fleaMarketMain');
      } catch (err) {
        console.error('Error:', err);
      }
    };

    const handleFileUpload = (event) => {
      mfilePath.value = event.target.files[0];
    };

    const back = () => {
      router.push('/fleaMarketMain');
    };

    onMounted(() => {
      userid.value = getUserIdFromToken();
      Axioscategories();
    });

    return {
      title,
      price,
      contents,
      category,
      categories,
      mfilePath,
      errors,
      fleamarketInput,
      handleFileUpload,
      back,
      userid,
    };
  },
};
</script>

