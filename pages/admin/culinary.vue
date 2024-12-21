<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
const { $swalFire } = useNuxtApp();
const { $bsModal } = useNuxtApp();

const cookie = useCookie('auth');
const culinaryData = ref({});
const modal = ref(null);
const delModal = ref(null);
const isUpdate = ref(false);
const tempCulinaryData = ref({
  title: '',
  description: '',
  diningTime: '',
  image: '',
});

// {
//   "title": "修改 - 海霸",
//   "description": "修改 - 以新鮮海產料理聞名...",
//   "diningTime": "SUN-MON 11:00-20:30",
//   "image": "修改 - https://fakeimg.pl/300/"
// }

const getCulinaryApi = () =>
  $fetch(`/api/v1/admin/culinary/`, {
    method: 'GET',
    baseURL: 'https://freyja-wtj7.onrender.com/',
    headers: {
      Authorization: cookie.value,
    },
  });
const { data } = await useAsyncData('getCulinary', () => getCulinaryApi());
culinaryData.value = data.value.result;

/**
 * 更新文章
 */
const setCulinary = async ({ _id, title, description, diningTime, image }) => {
  const method = _id ? 'PUT' : 'POST';
  const apiUrl = _id
    ? `/api/v1/admin/culinary/${_id}`
    : `/api/v1/admin/culinary/`;
  const apiData = { title, description, image, diningTime };

  try {
    const message = _id ? '成功更新文章' : '成功新增文章';
    const res = await $fetch(apiUrl, {
      method: method,
      baseURL: 'https://freyja-wtj7.onrender.com/',
      body: apiData,
      headers: {
        Authorization: cookie.value,
      },
    });
    $swalFire({ title: message, icon: 'success' });
    getCulinary();
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
 * 取得文章
 */
const getCulinary = async () => {
  const { result } = await getCulinaryApi();
  culinaryData.value = result;
};

/**
 * 刪除文章
 */
const deleteCulinary = async ({ _id }) => {  
  try {
    const res = await $fetch(`/api/v1/admin/culinary/${_id}`, {
      method: 'DELETE',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      headers: {
        Authorization: cookie.value,
      },
    });
    $swalFire({ title: '成功刪除', icon: 'success' });
    getCulinary();
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
    tempCulinaryData.value = {};
    return;
  }
  isUpdate.value = true;
  tempCulinaryData.value = { ...data };
};
const openDelModal = (data) => {
  delModal.value.open();
  if (data) {
    tempCulinaryData.value = { ...data };
  }
};

onMounted(() => {
  modal.value = $bsModal('#culinary-modal');
  delModal.value = $bsModal('#delModal');
});
</script>

<template>
  <div>
    <div class="p-3">
      <h3>美味佳餚列表</h3>
      <hr />
      <div class="text-end">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="openModal()"
        >
          建立新文章
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
          <tr v-for="item in culinaryData" :key="item.id">
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
      id="culinary-modal"
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
                      v-model="tempCulinaryData.image"
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
                      v-model="tempCulinaryData.title"
                      type="text"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      class="form-control"
                    />
                  </label>
                </div>
                <div class="form-group mb-2">
                  <label class="w-100" for="title">
                    營業時間
                    <input
                      v-model="tempCulinaryData.diningTime"
                      type="text"
                      id="title"
                      name="title"
                      placeholder="請輸入營業時間"
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
                      v-model="tempCulinaryData.description"
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
            <button type="button" class="btn btn-primary" @click="setCulinary(tempCulinaryData)">儲存</button>
          </div>
        </div>
      </div>
    </div>
    <ModalDelete
      :content="`${tempCulinaryData.title}`"
      :closeModal="() => delModal.close()"
      :deleteMethod="() => deleteCulinary(tempCulinaryData)"
    />
  </div>
</template>

<style lang="scss" scoped>
.max-w-200px {
  max-width: 200px;
}
</style>