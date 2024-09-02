<template>
  <div id="create">
    <form @submit.prevent="fleamarketInput" method="post" enctype="multipart/form-data">
      <span>
        <sup>*</sup>
        <label for="title">제목 :</label>
        <input type="text" v-model="title" name="title" id="title"/>
        <span v-if="errors.title" class="error">{{ errors.title }}</span>
        <br />
      </span>
      <span>
        <sup>*</sup>
        <label for="price">가격 :</label>
        <input type="text" v-model="price" name="price" id="price"/>
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
        <select v-model="category" name="category">
          <option value="전체">전체</option>
          <option value="베이비의류(0-2세)">베이비의류(0-2세)</option>
          <option value="여아의류(3-6세)">여아의류(3-6세)</option>
          <option value="남아의류(3-6세)">남아의류(3-6세)</option>
          <option value="여아 주니어의류(7세 -)">여아 주니어의류(7세 -)</option>
          <option value="남아 주니어의류(7세 -)">남아 주니어의류(7세 -)</option>
          <option value="신발/가방/잡화">신발/가방/잡화</option>
          <option value="유아용품">유아용품</option>
          <option value="일부의류/용품">일부의류/용품</option>
          <option value="교구/완구/인형">교구/완구/인형</option>
          <option value="수유/이유용품">수유/이유용품</option>
        </select>
        <span v-if="errors.category" class="error">{{ errors.category }}</span>
        <br />
      </span>
      <span>
        <sup>*</sup>
        <input type="file" name="mfilePath" id="file" @change="handleFileUpload">
        <span v-if="errors.filePath" class="error">{{ errors.filePath }}</span>
      </span>
      <input type="submit" value="업로드">
      <span>
        <input type="button" value="돌아가기" @click="back">
      </span>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'fleaMarketCreate',
  setup() {
    const userid = ref("user1");
    const title = ref("");
    const price = ref("");
    const contents = ref("");
    const category = ref("");
    const mfilePath = ref(null);
    const errors = ref({});

    const validateForm = () => {
      errors.value = {};

      if (!title.value) {
        errors.value.title = '제목을 입력해 주세요.';
      }
      if (!price.value) {
        errors.value.price = '가격을 입력해 주세요.';
      }
      if (!contents.value) {
        errors.value.contents = '설명을 입력해 주세요.';
      }
      if (!category.value) {
        errors.value.category = '카테고리를 선택해 주세요.';
      }
      if (!mfilePath.value) {
        errors.value.filePath = '사진을 선택해 주세요.';
      }

      return Object.keys(errors.value).length === 0;
    };

    const fleamarketInput = async () => {
      if (!validateForm()) {
        return;
      }

      const formData = new FormData();
      const dto = {
        userid: userid.value,
        title: title.value,
        price: price.value,
        contents: contents.value,
        category: category.value
      };

      formData.append("dto", JSON.stringify(dto));

      if (mfilePath.value) {
        formData.append("mfile", mfilePath.value);
      }

      try {
        await fetch("http://localhost:80/fleaMarket", {
          method: "POST",
          body: formData
        });
        alert('성공');
        window.location.href = 'fleamarket.html';
      } catch (err) {
        console.error('Error:', err);
      }
    };

    const handleFileUpload = (event) => {
      mfilePath.value = event.target.files[0];
    };

    const back = () => {
      window.location.href = 'fleamarket.html';
    };

    return {
      title,
      price,
      contents,
      category,
      mfilePath,
      errors,
      fleamarketInput,
      handleFileUpload,
      back
    };
  }
};
</script>

<style src="../css/fleaCreate.css"></style>