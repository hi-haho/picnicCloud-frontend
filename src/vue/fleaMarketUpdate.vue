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
        <!-- 카테고리 -->
        <select name="category" v-model="datas.category">
          <option>전체</option>
          <option>베이비의류(0-2세)</option>
          <option>여아의류(3-6세)</option>
          <option>남아의류(3-6세)</option>
          <option>여아 주니어의류(7세 -)</option>
          <option>남아 주니어의류(7세 -)</option>
          <option>신발/가방/잡화</option>
          <option>유아용품</option>
          <option>일부의류/용품</option>
          <option>교구/완구/인형</option>
          <option>수유/이유용품</option>
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
import apiClient from '@/api/api.js';

export default {
  name: 'fleaMarketUpdate',
  setup() {
    const datas = ref({});
    const no = ref(null);

    const updateData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      no.value = urlParams.get('no');
      
      try {
        const response = await apiClient.get(`/fleaMarket/${no.value}`);
        datas.value = response.data;
      } catch (err) {
        console.error("fleaUpdate Axios Fail:", err);
      }
    };

    const update = async () => {
      try {
        await apiClient.put(`/fleaMarket/${no.value}`, datas.value);
        if (confirm("수정하시겠습니까?")) {
          window.location.href = `fleamarketDetail.html?no=${no.value}`;
        }
      } catch (err) {
        alert("수정 실패: " + err);
      }
    };

    const cancel = () => {
      window.location.href = `fleamarketDetail.html?no=${no.value}`;
    };

    onMounted(() => {
      updateData();
    });

    return {
      datas,
      no,
      update,
      cancel
    };
  }
};
</script>
