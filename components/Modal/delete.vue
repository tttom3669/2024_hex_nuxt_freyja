<script setup>
defineProps({
  content: String,
  deleteMethod: Function,
  closeModal: Function,
});
// console.log(props.closeModal);
</script>

<template>
  <div
    id="delModal"
    class="modal fade"
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger">
          <h1 class="modal-title text-white fs-5" id="exampleModalLabel">
            刪除確認
          </h1>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          />
        </div>
        <div class="modal-body">刪除 {{ content }}</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteMethod">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
