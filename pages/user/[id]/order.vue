<script setup>
const { $swalFire, $bsModal } = useNuxtApp();
const route = useRoute();
const cookie = useCookie('auth');
const { formatDate } = useBookingFun();
const historyOrder = ref([]);
const currentOrder = ref([]);
const closestOrder = ref([]);
const cancelModal = ref(null);


const { data: userResult } = await useFetch(`/api/v1/user/`, {
  method: 'GET',
  baseURL: 'https://freyja-wtj7.onrender.com/',
  headers: {
    Authorization: cookie.value,
  },
});
const getOrderApi = () =>
  $fetch(`/api/v1/orders/`, {
    method: 'GET',
    baseURL: 'https://freyja-wtj7.onrender.com/',
    headers: {
      Authorization: cookie.value,
    },
  });
const { data: orderResult } = await useAsyncData('getOrder', () =>
  getOrderApi()
);
orderInit(orderResult.value?.result);

const getOrder = async () => {
  const { result } = await getOrderApi();
  orderInit(result);
};

function orderInit(result) {
  const filterResult = result.filter((item) => item.status !== -1);
  // 即將來的行程
  closestOrder.value = filterResult.reduce((closest, current) => {
    const closestDate = new Date(closest.checkInDate);
    const currentDate = new Date(current.checkInDate);
    return currentDate < closestDate ? current : closest;
  });

  historyOrder.value = filterResult.sort(
    (a, b) => new Date(a.checkInDate) - new Date(b.checkInDate)
  );

  if (historyOrder.value?.length >= 3) {
    currentOrder.value = historyOrder.value.slice(0, 3).slice(0, 3);
  } else {
    currentOrder.value = [...historyOrder.value];
  }
}

const daysCount = (checkInDate, checkOutDate) => {
  const differenceTime =
    new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();

  const differenceDay = Math.round(differenceTime / (1000 * 60 * 60 * 24));
  return differenceDay;
};

const cancelOrder = async (id) => {
  try {
    const { c } = await $fetch(`/api/v1/orders/${id}`, {
      method: 'DELETE',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      headers: {
        Authorization: cookie.value,
      },
    });
    $swalFire({ title: '成功取消訂單', icon: 'success' });
    cancelModal.value.close();
    getOrder();
  } catch (error) {
    $swalFire({
      title: error.response._data.message || '取消訂單失敗',
      icon: 'error',
    });
  }
};

onMounted(() => {
  cancelModal.value = $bsModal('#cancelModal');
});
</script>

<template>
  <div>
    <div class="row gap-6 gap-md-0">
      <div class="col-12 col-md-7">
        <div
          class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
          style="max-width: 730px"
        >
          <div>
            <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
              預訂參考編號： {{ closestOrder._id }}
            </p>
            <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
              即將來的行程
            </h2>
          </div>

          <img
            class="img-fluid rounded-3"
            :src="closestOrder.roomId.imageUrl"
            alt="room-a"
          />

          <section class="d-flex flex-column gap-6">
            <h3
              class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
            >
              <p class="mb-0">
                {{ closestOrder.roomId.name }}，{{
                  daysCount(closestOrder.checkInDate, closestOrder.checkOutDate)
                }}
                晚
              </p>
              <span
                class="d-inline-block mx-4 bg-neutral-80"
                style="width: 1px; height: 18px"
              />
              <p class="mb-0">住宿人數：{{ closestOrder.peopleNum }} 位</p>
            </h3>

            <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
              <p class="title-deco mb-2">
                入住：{{ formatDate(closestOrder.checkInDate) }}，15:00 可入住
              </p>
              <p class="title-deco mb-0">
                退房：{{ formatDate(closestOrder.checkOutDate) }}，12:00 前退房
              </p>
            </div>

            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
              NT$
              {{
                (
                  closestOrder.roomId.price *
                  daysCount(closestOrder.checkInDate, closestOrder.checkOutDate)
                ).toLocaleString('zh-TW')
              }}
            </p>
          </section>

          <hr class="my-0 opacity-100 text-neutral-40" />

          <section>
            <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
              房內設備
            </h3>
            <ul
              class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
            >
              <li
                v-for="(facility, idx) in closestOrder.roomId.facilityInfo"
                :key="idx"
                class="flex-item d-flex gap-2"
              >
                <Icon
                  v-if="facility.isProvide"
                  class="fs-5 text-primary-100"
                  icon="material-symbols:check"
                />
                <p class="mb-0 text-neutral-80 fw-bold">{{ facility.title }}</p>
              </li>
            </ul>
          </section>

          <section>
            <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
              備品提供
            </h3>
            <ul
              class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
            >
              <li
                v-for="(amenity, idx) in closestOrder.roomId.amenityInfo"
                :key="idx"
                class="flex-item d-flex gap-2"
              >
                <Icon
                  v-if="amenity.isProvide"
                  class="fs-5 text-primary-100"
                  icon="material-symbols:check"
                />
                <p class="mb-0 text-neutral-80 fw-bold">{{ amenity.title }}</p>
              </li>
            </ul>
          </section>

          <div class="d-flex gap-4">
            <button
              data-bs-toggle="modal"
              data-bs-target="#cancelModal"
              class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
              style="--bs-btn-hover-color: #fff"
              type="button"
            >
              取消預訂
            </button>
            <NuxtLink
              :to="`/rooms/${closestOrder.roomId._id}`"
              class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
              type="button"
            >
              查看詳情
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-5">
        <div
          class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
        >
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">歷史訂單</h2>
          <div
            class="position-relative d-flex flex-column gap-6 gap-md-10"
            v-for="(order, idx) in currentOrder"
            :key="idx"
          >
            <div class="d-flex flex-column flex-lg-row gap-6">
              <img
                class="img-fluid object-fit-cover rounded-3"
                style="max-width: 120px; height: 80px"
                :src="order.roomId.imageUrl"
                alt="room-a"
              />
              <section class="d-flex flex-column gap-4">
                <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  預訂參考編號： {{ order._id }}
                </p>

                <NuxtLink
                  to="javascript:;"
                  class="stretched-link text-decoration-none"
                  @click="closestOrder = { ...order }"
                >
                  <h3
                    class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
                  >
                    {{ order.roomId.name }}
                  </h3>
                </NuxtLink>

                <div class="text-neutral-80 fw-medium">
                  <p class="mb-2">
                    住宿天數：
                    {{ daysCount(order.checkInDate, order.checkOutDate) }} 晚
                  </p>
                  <p class="mb-0">住宿人數：{{ order.peopleNum }} 位</p>
                </div>

                <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                  <p class="title-deco mb-2">
                    入住：{{ formatDate(order.checkInDate) }}，15:00 可入住
                  </p>
                  <p class="title-deco mb-0">
                    退房：{{ formatDate(order.checkOutDate) }}，12:00 前退房
                  </p>
                </div>
                <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                  NT$
                  {{
                    (
                      order.roomId.price *
                      daysCount(order.checkInDate, order.checkOutDate)
                    ).toLocaleString('zh-TW')
                  }}
                </p>
              </section>
            </div>

            <hr
              v-if="idx < currentOrder?.length - 1"
              class="my-0 opacity-100 text-neutral-40"
            />
          </div>
          <button
            v-if="historyOrder?.length !== currentOrder?.length"
            @click="currentOrder = [...historyOrder]"
            class="btn btn-outline-primary-100 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
          >
            查看更多
          </button>
        </div>
      </div>
    </div>

    <div id="cancelModal" class="modal fade" tabindex="-1">
      <div
        class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100"
      >
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div
            class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold"
          >
            確定要取消此房型的預訂嗎？
          </div>
          <div class="modal-footer d-flex gap-4">
            <button
              type="button"
              class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
              style="--bs-btn-hover-color: #fff"
              data-bs-dismiss="modal"
            >
              關閉視窗
            </button>
            <button
              type="button"
              @click="cancelOrder(closestOrder._id)"
              class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
            >
              確定取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/mixins/breakpoints';

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #bf9d7d;
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}

.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
