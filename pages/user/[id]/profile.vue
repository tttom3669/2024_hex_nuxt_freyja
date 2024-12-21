<script setup>
const { $swalFire } = useNuxtApp();
const isEditPassword = ref(false);
const isEditProfile = ref(false);
const userData = ref({});
const cookie = useCookie('auth');
const getUserApi = () =>
  $fetch(`/api/v1/user/`, {
    method: 'GET',
    baseURL: 'https://freyja-wtj7.onrender.com/',
    headers: {
      Authorization: cookie.value,
    },
  });
const { data: userResult } = await useAsyncData('getOrder', () => getUserApi());

const getUser = async () => {
  const { result } = await getUserApi();
  userDataInit(result);
};

const {
  cityData,
  regionData,
  addressData,
  changeCity,
  formatAddress,
  regionInit,
} = useCity();

const birthData = ref({});
const formateBirth = ref('');
const updateUserData = ref({});
const oldPassword = ref('');
const newPassword = ref('');

function userDataInit(result) {
  userData.value = result;
  const birthDay = new Date(userData.value.birthday);
  const year = birthDay.getFullYear();
  const month = birthDay.getMonth() + 1;
  const day = birthDay.getDate();

  birthData.value = {
    year,
    month,
    day,
  };
  formateBirth.value = `${year} 年 ${month} 月 ${day} 日`;

  const regex = /(.+市)(.+區)(.+)/;
  const addressArr = userData.value.address.detail.match(regex).slice(1);
  addressData.value = {
    city: addressArr[0],
    address: addressArr[2],
    zipcode: userData.value.address.zipcode,
  };
  regionInit();
}

userDataInit(userResult?.value?.result);

const updateUser = async (value, { resetForm }) => {
  updateUserData.value = {
    userId: userData.value._id,
    name: userData.value.name,
    phone: userData.value.phone,
    birthday: `${birthData.value.year}/${birthData.value.month}/${birthData.value.day}`,
    address: {
      zipcode: addressData.value.zipcode,
      detail: formatAddress.value,
    },
  };
  if (oldPassword.value !== '' || newPassword.value !== '') {
    updateUserData.value.oldPassword = oldPassword.value;
    updateUserData.value.newPassword = newPassword.value;
  }
  try {
    const res = await $fetch(`/api/v1/user/`, {
      method: 'PUT',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      headers: {
        Authorization: cookie.value,
      },
      body: { ...updateUserData.value },
    });
    $swalFire({ title: '成功更新', icon: 'success' });

    if (oldPassword.value !== '' || newPassword.value !== '') {
      resetForm();
    }
    getUser();
  } catch (error) {
    $swalFire({
      title: error.response._data.message || '更新失敗',
      icon: 'error',
    });
  }
};
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <section
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
      >
        <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
        <Form v-slot="{ errors }" @submit="updateUser">
          <div class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                >{{ userData.email }}</span
              >
            </div>

            <div
              class="d-flex justify-content-between align-items-center"
              :class="{ 'd-none': isEditPassword }"
            >
              <div>
                <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  密碼
                </label>
                <input
                  class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                  type="password"
                  value="**********"
                />
              </div>

              <button
                class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                type="button"
                @click="isEditPassword = !isEditPassword"
              >
                重設
              </button>
            </div>

            <div
              class="d-flex flex-column gap-4 gap-md-6"
              :class="{ 'd-none': !isEditPassword }"
            >
              <div>
                <label for="oldPassword" class="form-label fs-8 fs-md-7 fw-bold"
                  >舊密碼</label
                >
                <Field
                  v-model="oldPassword"
                  id="oldPassword"
                  name="舊密碼"
                  type="password"
                  class="form-control p-4 fs-7 rounded-3"
                  :class="{ 'is-invalid': errors['舊密碼'] }"
                  placeholder="請輸入舊密碼"
                  rules="required|userPassword"
                />
                <ErrorMessage class="invalid-feedback" name="舊密碼" />
              </div>

              <div>
                <label for="newPassword" class="form-label fs-8 fs-md-7 fw-bold"
                  >新密碼</label
                >
                <Field
                  v-model="newPassword"
                  id="newPassword"
                  name="新密碼"
                  type="password"
                  class="form-control p-4 fs-7 rounded-3"
                  :class="{ 'is-invalid': errors['新密碼'] }"
                  placeholder="請輸入新密碼"
                  rules="required|userPassword"
                />
                <ErrorMessage class="invalid-feedback" name="新密碼" />
              </div>

              <div>
                <label
                  for="confirmPassword"
                  class="form-label fs-8 fs-md-7 fw-bold"
                  >確認新密碼</label
                >
                <Field
                  id="confirmPassword"
                  type="password"
                  name="確認密碼"
                  rules="required|confirmedPassword:新密碼"
                  class="form-control p-4 fs-7 rounded-3"
                  :class="{ 'is-invalid': errors['確認密碼'] }"
                  placeholder="請再輸入一次新密碼"
                />
                <ErrorMessage class="invalid-feedback" name="確認密碼" />
              </div>
            </div>

            <button
              :class="{ 'd-none': !isEditPassword }"
              class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
              type="submit"
            >
              儲存設定
            </button>
          </div>
        </Form>
      </section>
    </div>

    <div class="col-12 col-md-7">
      <section class="rounded-3xl p-6 p-md-10 bg-neutral-0">
        <Form
          class="d-flex flex-column gap-6 gap-md-10"
          v-slot="{ errors }"
          @submit="updateUser"
        >
          <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>

          <div class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile,
                }"
                for="姓名"
              >
                姓名
              </label>
              <Field
                id="name"
                name="姓名"
                v-model="userData.name"
                class="form-control text-neutral-100 fw-bold"
                :class="{
                  'pe-none p-0 border-0': !isEditProfile,
                  'p-4': isEditProfile,
                  'is-invalid': errors['姓名'],
                }"
                rules="required|userName"
                type="text"
              />
              <ErrorMessage class="invalid-feedback" name="姓名" />
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile,
                }"
                for="phone"
              >
                手機號碼
              </label>
              <Field
                id="phone"
                name="手機號碼"
                v-model="userData.phone"
                class="form-control text-neutral-100 fw-bold"
                :class="{
                  'pe-none p-0 border-0': !isEditProfile,
                  'p-4': isEditProfile,
                  'is-invalid': errors['手機號碼'],
                }"
                rules="required|userPhone"
                type="tel"
              />
              <ErrorMessage class="invalid-feedback" name="手機號碼" />
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile,
                }"
                for="birth"
              >
                生日
              </label>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                :class="{ 'd-none': isEditProfile }"
                >{{ formateBirth }}</span
              >
              <div class="d-flex gap-2" :class="{ 'd-none': !isEditProfile }">
                <select
                  id="birth"
                  v-model="birthData.year"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                >
                  <option
                    v-for="year in 65"
                    :key="year"
                    :value="`${year + 1958}`"
                  >
                    {{ year + 1958 }} 年
                  </option>
                </select>
                <select
                  v-model="birthData.month"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                >
                  <option v-for="month in 12" :key="month" :value="`${month}`">
                    {{ month }} 月
                  </option>
                </select>
                <select
                  v-model="birthData.day"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                >
                  <option v-for="day in 30" :key="day" :value="`${day}`">
                    {{ day }} 日
                  </option>
                </select>
              </div>
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile,
                }"
                for="address"
              >
                地址
              </label>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                :class="{ 'd-none': isEditProfile }"
                >{{ userData.address.detail }}</span
              >
              <div :class="{ 'd-none': !isEditProfile }">
                <div class="d-flex gap-2 mb-2">
                  <select
                    @change="changeCity"
                    v-model="addressData.city"
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  >
                    <option
                      v-for="city in cityData"
                      :key="city.name"
                      :value="city.name"
                    >
                      {{ city.name }}
                    </option>
                  </select>
                  <select
                    v-model="addressData.zipcode"
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
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
                  v-model="addressData.address"
                  id="address"
                  type="text"
                  name="地址"
                  class="form-control p-4 rounded-3"
                  :class="{ 'is-invalid': errors['地址'] }"
                  placeholder="請輸入詳細地址"
                  rules="required"
                />
                <ErrorMessage class="invalid-feedback" name="地址" />
              </div>
            </div>
          </div>
          <button
            :class="{ 'd-none': isEditProfile }"
            class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
            type="button"
            @click="isEditProfile = !isEditProfile"
          >
            編輯
          </button>

          <button
            :class="{ 'd-none': !isEditProfile }"
            class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
            type="submit"
          >
            儲存設定
          </button>
        </Form>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type='password'] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
