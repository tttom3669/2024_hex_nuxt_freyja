<script setup>
import BookingLoading from '@/components/rooms/BookingLoading.vue';
const {
  cityData,
  regionData,
  addressData,
  changeCity,
  formatAddress,
  regionInit,
} = useCity();
const { formatDate } = useBookingFun();
const { getRoomData, getBookingData } = useBookingStore();
const { $swalFire } = useNuxtApp();
const roomData = ref({});
const bookingData = ref({});
const userData = ref({});
const submitButtonRef = ref(null);
const cookie = useCookie('auth');

const { data: userResult } = await useFetch(`/api/v1/user/`, {
  method: 'GET',
  baseURL: 'https://freyja-wtj7.onrender.com/',
  headers: {
    Authorization: cookie.value,
  },
});

const confirmReservation = () => {
  submitButtonRef.value.click();
};

/**
 * 套用使用者資料
 */
const useUserData = () => {
  const { name, phone, email, address } = userResult.value.result;
  const regex = /(.+市)(.+區)(.+)/;
  const addressArr = address.detail.match(regex).slice(1);
  userData.value = {
    name,
    phone,
    email,
  };

  // 取得目前的 city 並套用對應 region
  addressData.value.city = addressArr[0];
  regionInit();

  addressData.value = {
    zipcode: address.zipcode,
    city: addressArr[0],
    address: addressArr[2],
    detail: address.detail,
  };
};
const router = useRouter();

const goBack = () => {
  router.back();
};
const isLoading = ref(false);

const confirmBooking = async () => {
  isLoading.value = true;
  const confirmData = {
    roomId: roomData.value._id,
    checkInDate: bookingData.value.checkInDate,
    checkOutDate: bookingData.value.checkOutDate,
    peopleNum: bookingData.value.peopleNum,
    userInfo: {
      address: {
        zipcode: addressData.value.zipcode,
        detail: addressData.value.detail,
      },
      name: userData.value.name,
      phone: userData.value.phone,
      email: userData.value.email,
    },
  };
  try {
    const { result } = await $fetch(`/api/v1/orders/`, {
      method: 'POST',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      body: { ...confirmData },
      headers: {
        Authorization: cookie.value,
      },
    });
    router.push(`/booking/confirmation/${result._id}`);
  } catch (error) {
    $swalFire({
      title: error.response?._data?.message || '更新失敗',
      icon: 'error',
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  bookingData.value = getBookingData();
  roomData.value = getRoomData();
});
</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon class="fs-5 text-neutral-100" icon="mdi:keyboard-arrow-left" />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">確認訂房資訊</h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">選擇房型</h3>
                    <p class="mb-0 fw-medium">{{ roomData.name }}</p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">訂房日期</h3>
                    <p class="mb-2 fw-medium">
                      入住：{{ formatDate(bookingData.checkInDate) }}
                    </p>
                    <p class="mb-0 fw-medium">
                      退房：{{ formatDate(bookingData.checkOutDate) }}
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">房客人數</h3>
                    <p class="mb-0 fw-medium">{{ bookingData.peopleNum }} 人</p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <div
                class="d-flex justify-content-between align-items-center mb-10"
              >
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                  @click="useUserData"
                >
                  套用會員資料
                </button>
              </div>
              <Form v-slot="{ errors }" @submit="confirmBooking">
                <div class="d-flex flex-column gap-6">
                  <div class="text-neutral-100">
                    <label for="name" class="form-label fs-8 fs-md-7 fw-bold"
                      >姓名</label
                    >
                    <Field
                      id="name"
                      type="text"
                      name="姓名"
                      v-model="userData.name"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['姓名'] }"
                      placeholder="請輸入姓名"
                      rules="required|userName"
                    />
                    <ErrorMessage class="invalid-feedback" name="姓名" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="phone" class="form-label fs-8 fs-md-7 fw-bold"
                      >手機號碼</label
                    >
                    <Field
                      id="phone"
                      type="tel"
                      name="手機號碼"
                      v-model="userData.phone"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['手機號碼'] }"
                      rules="required|userPhone"
                      placeholder="請輸入手機號碼"
                    />
                    <ErrorMessage class="invalid-feedback" name="手機號碼" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="email" class="form-label fs-8 fs-md-7 fw-bold"
                      >電子信箱</label
                    >
                    <Field
                      id="email"
                      type="email"
                      name="電子信箱"
                      v-model="userData.email"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['電子信箱'] }"
                      placeholder="請輸入電子信箱"
                      rules="required"
                    />
                    <ErrorMessage class="invalid-feedback" name="電子信箱" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="address" class="form-label fs-8 fs-md-7 fw-bold"
                      >地址</label
                    >
                    <div className="d-flex gap-2 mb-4">
                      <select
                        v-model="addressData.city"
                        @change="changeCity"
                        class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                      >
                        <option
                          v-for="city in cityData"
                          :value="city.name"
                          :key="city.name"
                        >
                          {{ city.name }}
                        </option>
                      </select>
                      <select
                        v-model="addressData.zipcode"
                        class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                      >
                        <option
                          v-for="region in regionData"
                          :value="region.value"
                          :key="region.value"
                        >
                          {{ region.name }}
                        </option>
                      </select>
                    </div>
                    <Field
                      id="address"
                      name="地址"
                      type="text"
                      :class="{ 'is-invalid': errors['地址'] }"
                      v-model="addressData.address"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      placeholder="請輸入詳細地址"
                      rules="required"
                    />
                    <ErrorMessage class="invalid-feedback" name="地址" />
                  </div>
                </div>
                <button
                  type="submit"
                  class="d-none"
                  ref="submitButtonRef"
                ></button>
              </Form>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomData.areaInfo }}
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomData.bedInfo }}
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomData.maxPeople <= 4 ? '2-4人' : '超過 4 人' }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房間格局
                  </h3>
                  <ul
                    class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="(layout, idx) in roomData.layoutInfo"
                      :key="idx"
                      class="d-flex gap-2"
                    >
                      <Icon
                        v-if="layout.isProvide"
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ layout.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房內設備
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="(facility, idx) in roomData.facilityInfo"
                      :key="idx"
                      class="flex-item d-flex gap-2"
                    >
                      <Icon
                        v-if="facility.isProvide"
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ facility.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    備品提供
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="(amenity, idx) in roomData.amenityInfo"
                      :key="idx"
                      class="flex-item d-flex gap-2"
                    >
                      <Icon
                        v-if="amenity.isProvide"
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ amenity.title }}
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                :src="roomData.imageUrl"
                alt="room-a"
              />

              <div>
                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div
                    class="d-flex align-items-center text-neutral-100 fw-medium"
                  >
                    <span>
                      NT$ {{ roomData?.price?.toLocaleString('zh-TW') }}</span
                    >
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      icon="material-symbols:close"
                    />
                    <span class="text-neutral-80"
                      >{{ bookingData.daysCount }} 晚</span
                    >
                  </div>
                  <span class="fw-medium">
                    NT$
                    {{
                      (roomData.price * bookingData.daysCount)?.toLocaleString(
                        'zh-TW'
                      )
                    }}</span
                  >
                </div>
                <div
                  class="d-flex justify-content-between align-items-center fw-medium"
                >
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100"> -NT$ 1,000 </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40" />
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold"
                >
                  <p class="d-flex align-items-center mb-0">總價</p>
                  <span>
                    NT$
                    {{
                      (
                        roomData.price * bookingData.daysCount -
                        1000
                      )?.toLocaleString('zh-TW')
                    }}
                  </span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="confirmReservation"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingLoading v-if="isLoading" />
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #bf9d7d;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>
