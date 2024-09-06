<template>
    <div class="search-bar">
      <input
        v-model="localSearchQuery"
        @keydown.enter="onSearch"
        :placeholder="placeholder"
      />
      <button @click="onSearch">검색</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      searchQuery: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        default: '검색어를 입력하세요',
      },
    },
    data() {
      return {
        localSearchQuery: this.searchQuery,
      };
    },
    methods: {
      onSearch() {
        this.$emit('search', this.localSearchQuery); // 부모 컴포넌트에 검색어 전달
      },
    },
    watch: {
      searchQuery(newQuery) {
        this.localSearchQuery = newQuery;
      },
    },
  };
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  input {
    flex: 1;
    padding: 8px;
  }
  button {
    padding: 8px;
  }
  </style>
  