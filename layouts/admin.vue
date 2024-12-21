<script setup></script>

<template>
  <div>
    <AdminHeader />
    <div class="mt-30">
      <div class="d-flex">
        <div class="flex-none">
          <ul class="list-group list-group-flush">
            <NuxtLink
              class="list-group-item list-group-item-action py-3 text-nowrap"
              to="/admin/news"
            >
              <i class="bi bi-cup-fill me-2" />
              最新消息列表
            </NuxtLink>
            <NuxtLink
              class="list-group-item list-group-item-action py-3 text-nowrap"
               to="/admin/rooms"
            >
              <i class="bi bi-ticket-perforated-fill me-2" />
              房型列表
            </NuxtLink>
            <NuxtLink
              class="list-group-item list-group-item-action py-3 text-nowrap"
              to="/admin/orders"
            >
              <i class="bi bi-receipt me-2" />
              訂單列表
            </NuxtLink>
          </ul>
        </div>
        <div class="flex-fill">
          <slot />
        </div>
      </div>
    </div>
    <!-- <AdminFooter /> -->
  </div>
</template>

<style lang="scss" scoped></style>
