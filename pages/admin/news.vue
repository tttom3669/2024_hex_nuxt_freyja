<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
const { $swalFire } = useNuxtApp();
const { $bsModal } = useNuxtApp();

const cookie = useCookie('auth');
const tempNewData = ref({
  title: '',
  description: '',
  image: '',
});
const newsData = ref([]);
const modal = ref(null);
const delModal = ref(null);
const isUpdate = ref(false);

const getNewApi = () =>
  $fetch(`/api/v1/admin/news/`, {
    method: 'GET',
    baseURL: 'https://freyja-wtj7.onrender.com/',
    headers: {
      Authorization: cookie.value,
    },
  });

const { data } = await useAsyncData('getNews', () => getNewApi());

/**
 * 取得消息
 */
const getNews = async () => {
  const { result } = await getNewApi();
  newsData.value = result;
  newsData.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
/**
 * 更新消息
 */
const setNew = async ({ _id, title, description, image }) => {
  const method = _id ? 'PUT' : 'POST';
  const apiUrl = _id ? `/api/v1/admin/news/${_id}` : `/api/v1/admin/news/`;
  const apiData = { title, description, image };

  try {
    const message = _id ? '成功更新消息' : '成功新增消息';
    $swalFire({ title: message, icon: 'success' });
    const res = await $fetch(apiUrl, {
      method: method,
      baseURL: 'https://freyja-wtj7.onrender.com/',
      body: apiData,
      headers: {
        Authorization: cookie.value,
      },
    });
    getNews();
  } catch (error) {
    $swalFire({
      title: error.response?._data?.message || '更新失敗',
      icon: 'error',
    });
  } finally {
    modal.value.close();
  }
};
/**
 * 刪除消息
 */
const deleteNew = async ({ _id }) => {
  try {
    $swalFire({ title: '成功刪除', icon: 'success' });
    const res = await $fetch(`/api/v1/admin/news/${_id}`, {
      method: 'DELETE',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      headers: {
        Authorization: cookie.value,
      },
    });
    getNews();
  } catch (error) {
    $swalFire({
      title: error.response?._data?.message || '刪除失敗',
      icon: 'error',
    });
  } finally {
    delModal.value.close();
  }
};

const openModal = (data) => {
  modal.value.open();
  if (!data) {
    isUpdate.value = false;
    tempNewData.value = {};
    return;
  }
  isUpdate.value = true;
  tempNewData.value = { ...data };
};
const openDelModal = (data) => {
  delModal.value.open();
  if (data) {
    tempNewData.value = { ...data };
  }
};

onMounted(() => {
  modal.value = $bsModal('#news-modal');
  delModal.value = $bsModal('#delModal');
  newsData.value = data.value.result;
  newsData.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});
</script>

<template>
  <div>
    <div class="p-3">
      <h3>最新消息列表</h3>
      <hr />
      <div class="text-end">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="openModal()"
        >
          建立新消息
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">名稱</th>
            <th class="w-50" scope="col">內容</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in newsData" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.description }}</td>
            <td>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="openModal(item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm ms-2"
                @click="openDelModal(item)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      id="news-modal"
      class="modal fade"
      tabIndex="-1"
      aria-labelledby="newsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newsModalLabel">
              {{ isUpdate ? '編輯文章' : '建立新文章' }}
            </h1>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="modal.close()"
            />
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    輸入圖片網址
                    <input
                      v-model="tempNewData.image"
                      type="text"
                      name="imageUrl"
                      id="image"
                      placeholder="請輸入圖片連結"
                      class="form-control"
                    />
                  </label>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="form-group mb-2">
                  <label class="w-100" for="title">
                    標題
                    <input
                      v-model="tempNewData.title"
                      type="text"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      class="form-control"
                    />
                  </label>
                </div>
                <hr />
                <div class="form-group mb-2">
                  <label class="w-100" for="description">
                    內容
                    <textarea
                      type="text"
                      v-model="tempNewData.description"
                      id="description"
                      name="description"
                      placeholder="請輸入文章描述"
                      class="form-control"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="modal.close()"
            >
              關閉
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="setNew(tempNewData)"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
    <ModalDelete
      :content="`${tempNewData.title}`"
      :closeModal="() => delModal.close()"
      :deleteMethod="() => deleteNew(tempNewData)"
    />
  </div>
</template>

<style lang="scss" scoped>
.max-w-200px {
  max-width: 200px;
}
</style>

<!-- [
    {
        "_id": "66b094e4afe4327b9a5637b4",
        "title": "秋季旅遊，豪華享受方案",
        "description": "秋天就是要來場豪華的旅遊！我們為您準備了一系列的秋季特別方案，包括舒適的住宿、美食饗宴，以及精彩的活動。不論您是想來一趟浪漫之旅，還是想和家人共度美好時光，都能在這裡找到最適合的方案。",
        "image": "https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/typescript-hotel/%E6%A1%8C%E6%A9%9F%E7%89%88/news1.png",
        "createdAt": "2024-08-05T09:01:24.668Z",
        "updatedAt": "2024-08-14T06:10:12.497Z"
    },
    {
        "_id": "66b09504afe4327b9a5637b7",
        "title": "輕鬆住房專案",
        "description": "我們知道，有時候您只是需要一個舒適的地方放鬆心情。因此，我們推出了「輕鬆住房專案」，讓您無壓力地享受住宿。不管是短期的休息，還是長期的住宿，我們都會以最貼心的服務，讓您感到賓至如歸。",
        "image": "https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/typescript-hotel/%E6%A1%8C%E6%A9%9F%E7%89%88/news2.png",
        "createdAt": "2024-08-05T09:01:56.905Z",
        "updatedAt": "2024-08-14T06:22:53.818Z"
    },
    {
        "_id": "66b09526afe4327b9a5637ba",
        "title": "耶誕快樂，住房送禮",
        "description": "聖誕節來臨，我們為您準備了特別的禮物！在聖誕期間訂房，不僅有特別優惠，還會送上我們精心準備的聖誕禮物。讓我們一起慶祝這個溫馨的節日吧！",
        "image": "https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/typescript-hotel/%E6%A1%8C%E6%A9%9F%E7%89%88/news3.png",
        "createdAt": "2024-08-05T09:02:30.324Z",
        "updatedAt": "2024-08-14T06:23:37.152Z"
    }
] -->
