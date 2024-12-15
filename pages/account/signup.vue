<script setup>
const { $swalFire } = useNuxtApp();
definePageMeta({
  layout: 'account',
});
const router = useRouter();
const isEmailAndPasswordValid = ref(false);
// 註冊用資料
const signupData = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  birthday: '',
  address: {
    zipcode: '100',
    detail: '',
  },
});
// 城市資料
const cityData = ref([
  {
    name: '臺北市',
    region: [
      { value: '100', name: '中正區' },
      { value: '103', name: '大同區' },
      { value: '104', name: '中山區' },
      { value: '105', name: '松山區' },
      { value: '106', name: '大安區' },
      { value: '108', name: '萬華區' },
      { value: '110', name: '信義區' },
      { value: '111', name: '士林區' },
      { value: '112', name: '北投區' },
      { value: '114', name: '內湖區' },
      { value: '115', name: '南港區' },
      { value: '116', name: '文山區' },
    ],
  },
  {
    name: '高雄市',
    region: [
      { value: '800', name: '新興區' },
      { value: '801', name: '前金區' },
      { value: '802', name: '苓雅區' },
      { value: '803', name: '鹽埕區' },
      { value: '804', name: '鼓山區' },
      { value: '805', name: '旗津區' },
      { value: '806', name: '前鎮區' },
      { value: '807', name: '三民區' },
      { value: '811', name: '楠梓區' },
      { value: '812', name: '小港區' },
      { value: '813', name: '左營區' },
      { value: '817', name: '東沙群島' },
      { value: '819', name: '南沙群島' },
      { value: '820', name: '仁武區' },
      { value: '821', name: '大社區' },
      { value: '822', name: '岡山區' },
      { value: '823', name: '路竹區' },
      { value: '824', name: '阿蓮區' },
      { value: '825', name: '田寮區' },
      { value: '826', name: '燕巢區' },
      { value: '827', name: '橋頭區' },
      { value: '828', name: '梓官區' },
      { value: '829', name: '彌陀區' },
      { value: '830', name: '永安區' },
      { value: '831', name: '湖內區' },
      { value: '832', name: '鳳山區' },
      { value: '833', name: '大寮區' },
      { value: '840', name: '林園區' },
      { value: '842', name: '鳥松區' },
      { value: '843', name: '大樹區' },
      { value: '844', name: '旗山區' },
      { value: '845', name: '美濃區' },
      { value: '846', name: '六龜區' },
      { value: '847', name: '內門區' },
      { value: '848', name: '杉林區' },
      { value: '849', name: '甲仙區' },
      { value: '851', name: '桃源區' },
      { value: '852', name: '那瑪夏區' },
      { value: '853', name: '茂林區' },
      { value: '854', name: '茄萣區' },
    ],
  },
  {
    name: '臺中市',
    region: [
      { value: '400', name: '中區' },
      { value: '401', name: '東區' },
      { value: '402', name: '南區' },
      { value: '403', name: '西區' },
      { value: '404', name: '北區' },
      { value: '406', name: '北屯區' },
      { value: '407', name: '西屯區' },
      { value: '408', name: '南屯區' },
      { value: '411', name: '太平區' },
      { value: '412', name: '大里區' },
      { value: '413', name: '霧峰區' },
      { value: '414', name: '烏日區' },
      { value: '420', name: '豐原區' },
      { value: '421', name: '后里區' },
      { value: '422', name: '石岡區' },
      { value: '423', name: '東勢區' },
      { value: '424', name: '和平區' },
      { value: '426', name: '新社區' },
      { value: '427', name: '潭子區' },
      { value: '428', name: '大雅區' },
      { value: '429', name: '神岡區' },
      { value: '432', name: '大肚區' },
      { value: '433', name: '沙鹿區' },
      { value: '434', name: '龍井區' },
      { value: '435', name: '梧棲區' },
      { value: '436', name: '清水區' },
      { value: '437', name: '大甲區' },
      { value: '438', name: '外埔區' },
      { value: '439', name: '大安區' },
    ],
  },
]);
// 區資料
const regionData = ref([]);
// 地址資料
const addressData = ref({
  city: cityData.value[0].name,
  address: '',
});
// 生日資歷
const birthData = ref({
  year: 1959,
  month: 1,
  day: 1,
});

const formatAddress = computed(() => {
  const region = regionData.value.filter(
    (item) => item.value === signupData.value.address.zipcode
  )[0]?.name;
  return addressData.value.city + region + addressData.value.address;
});

const birthDay = computed(
  () =>
    `${birthData.value.year}/${birthData.value.month}/${birthData.value.day}`
);

/**
 * 表單更換城市
 */
const changeCity = (e) => {
  const name = e.target.value;
  regionData.value = cityData.value.filter(
    (city) => city.name === name
  )[0].region;

  signupData.value.address.zipcode = regionData.value[0].value;
};
/**
 * 註冊使用者
 */
const signup = async () => {
  try {
    signupData.value.birthday = birthDay.value;
    signupData.value.address.detail = formatAddress.value;

    const res = await $fetch(`/api/v1/user/signup`, {
      method: 'POST',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      body: { ...signupData.value },
    });
    $swalFire({ title: '成功註冊', icon: 'success' });
    router.push('/account/login');
  } catch (error) {
    $swalFire({
      title: error.response._data.message || '註冊失敗',
      icon: 'error',
    });
  }
};

onMounted(() => {
  regionData.value = cityData.value[0].region;

});
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': isEmailAndPasswordValid }"
            class="step p-2 bg-primary-100 rounded-circle"
            >1</span
          >
          <Icon
            :class="{ 'd-none': !isEmailAndPasswordValid }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid,
            'text-neutral-60': !isEmailAndPasswordValid,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid,
              'bg-transparent border border-neutral-60':
                !isEmailAndPasswordValid,
            }"
            class="step p-2 rounded-circle"
            >2</span
          >
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <Form
        v-slot="{ errors }"
        :class="{ 'd-none': isEmailAndPasswordValid }"
        class="mb-4"
        @submit="isEmailAndPasswordValid = true"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="email">
            電子信箱
          </label>
          <Field
            id="email"
            name="電子信箱"
            v-model="signupData.email"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['電子信箱'] }"
            placeholder="hello@exsample.com"
            type="email"
            rules="required"
          />
          <ErrorMessage class="invalid-feedback" name="電子信箱" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="password">
            密碼
          </label>
          <Field
            id="password"
            name="密碼"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['密碼'] }"
            placeholder="請輸入密碼"
            v-model="signupData.password"
            type="password"
            rules="required|userPassword"
          />
          <ErrorMessage class="invalid-feedback" name="密碼" />
        </div>
        <div class="mb-10 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="confirmPassword">
            確認密碼
          </label>
          <Field
            name="確認密碼"
            rules="required|confirmedPassword:密碼"
            id="confirmPassword"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['確認密碼'] }"
            placeholder="請再輸入一次密碼"
            type="password"
          />
          <ErrorMessage class="invalid-feedback" name="確認密碼" />
        </div>
        <button
          class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
          type="submit"
        >
          下一步
        </button>
      </Form>
      <Form
        @submit="signup"
        v-slot="{ errors }"
        :class="{ 'd-none': !isEmailAndPasswordValid }"
        class="mb-4"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="name"> 姓名 </label>
          <Field
            id="name"
            name="姓名"
            v-model="signupData.name"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            type="text"
            rules="required|userName"
          />
          <ErrorMessage class="invalid-feedback" name="姓名" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="phone">
            手機號碼
          </label>
          <Field
            id="phone"
            name="手機號碼"
            v-model="signupData.phone"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            placeholder="請輸入手機號碼"
            type="tel"
            :class="{ 'is-invalid': errors['手機號碼'] }"
            rules="required|userPhone"
          />
          <ErrorMessage class="invalid-feedback" name="手機號碼" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="birth"> 生日 </label>
          <div class="d-flex gap-2">
            <select
              v-model="birthData.year"
              id="birth"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
            >
              <option v-for="year in 65" :key="year" :value="`${year + 1958}`">
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
        <div class="mb-4 fs-8 fs-md-7">
          <label class="form-label text-neutral-0 fw-bold" for="address">
            地址
          </label>
          <div>
            <div class="d-flex gap-2 mb-2">
              <select
                v-model="addressData.city"
                @change="changeCity"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
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
                v-model="signupData.address.zipcode"
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
              id="address"
              type="text"
              name="地址"
              @change="formatAddress"
              v-model="addressData.address"
              class="form-control p-4 rounded-3"
              :class="{ 'is-invalid': errors['地址'] }"
              placeholder="請輸入詳細地址"
              rules="required"
            />
            <ErrorMessage class="invalid-feedback" name="地址" />
          </div>
        </div>

        <div
          class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0"
        >
          <input
            id="agreementCheck"
            class="form-check-input"
            type="checkbox"
            value=""
          />
          <label class="form-check-label fw-bold" for="agreementCheck">
            我已閱讀並同意本網站個資使用規範
          </label>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="submit"
        >
          完成註冊
        </button>
      </Form>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
      </NuxtLink>
    </p>
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

input[type='password'] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
