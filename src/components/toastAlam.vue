<template>
    <div v-if="visible" class="toast" :class="type">
      <span>{{ message }}</span>
    </div>
  </template>
  
  <script>
  import './toastAlam.css';
  
  export default {
    data() {
      return {
        visible: false,
        message: "",
        type: "" // 'success', 'error', 'info' 등
      };
    },
    methods: {
      showToast(msg, type = 'info', duration = 3000) {
        this.message = msg;
        this.type = type;
        this.visible = true;
        setTimeout(() => {
          this.visible = false;
        }, duration);
      }
    }
  };
  </script>