<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
const { $swalFire } = useNuxtApp();
const { $bsModal } = useNuxtApp();
const cookie = useCookie('auth');
const modal = ref(null);
const delModal = ref(null);
const isUpdate = ref(false);
const tempData = ref({
  name: '',
  description: '',
  imageUrl: '',
  imageUrlList: [],
  areaInfo: '',
  bedInfo: '',
  maxPeople: 1,
  price: 1,
  layoutInfo: [],
  facilityInfo: [],
  amenityInfo: [],
});
const roomData = ref({});

const openModal = (data = 'init') => {
  isUpdate.value = data !== 'init' ? true : false;
  if (data !== 'init') {
    tempData.value = { ...data };
  } else {
    tempData.value = {
      name: '',
      description: '',
      imageUrl: '',
      imageUrlList: [],
      areaInfo: '',
      bedInfo: '',
      maxPeople: 1,
      price: 1,
      layoutInfo: [],
      facilityInfo: [],
      amenityInfo: [],
    };
  }
  modal.value.open();
};

const getRoomApi = () =>
  $fetch(`/api/v1/admin/rooms/`, {
    method: 'GET',
    baseURL: 'https://freyja-wtj7.onrender.com/',
    headers: {
      Authorization: cookie.value,
    },
  });

const { data: roomResult } = await useAsyncData('getRoom', () => getRoomApi());
const getRoom = async () => {
  const { result } = await getRoomApi();
  roomData.value = result;
};
const setRoom = async (data) => {
  const {
    _id,
    name,
    description,
    imageUrl,
    imageUrlList,
    areaInfo,
    bedInfo,
    maxPeople,
    price,
    layoutInfo,
    facilityInfo,
    amenityInfo,
  } = data;

  try {
    const apiUrl = _id ? `/api/v1/admin/rooms/${_id}` : '/api/v1/admin/rooms/';
    const method = _id ? 'PUT' : 'POST';

    const res = await $fetch(apiUrl, {
      method: method,
      baseURL: 'https://freyja-wtj7.onrender.com/',
      body: {
        name,
        description,
        imageUrl,
        imageUrlList,
        areaInfo,
        bedInfo,
        maxPeople,
        price,
        layoutInfo,
        facilityInfo,
        amenityInfo,
      },
      headers: {
        Authorization: cookie.value,
      },
    });
    const message = _id ? '成功更新房型' : '成功新增房型';
    getRoom();
    $swalFire({ title: message, icon: 'success' });
  } catch (error) {
    $swalFire({
      title: error.response?._data?.message || '更新失敗',
      icon: 'error',
    });
  } finally {
    modal.value.close();
  }
};
const deleteRoom = async ({ _id }) => {
  try {
    const res = await $fetch(`/api/v1/admin/rooms/${_id}`, {
      method: 'DELETE',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      headers: {
        Authorization: cookie.value,
      },
    });
    $swalFire({ title: '成功刪除', icon: 'success' });
    getRoom();
  } catch (error) {
    $swalFire({
      title: error.response?._data?.message || '刪除失敗',
      icon: 'error',
    });
  } finally {
    delModal.value.close();
  }
};
const openDelModal = (data) => {
  delModal.value.open();
  if (data) {
    tempData.value = { ...data };
  }
};

onMounted(() => {
  roomData.value = roomResult?.value?.result;
  modal.value = $bsModal('#rooms-modal');
  delModal.value = $bsModal('#delModal');
});
</script>

<template>
  <div>
    <div class="p-3">
      <h3>房型列表</h3>
      <hr />
      <div class="text-end">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="openModal()"
        >
          建立新房型
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
          <tr v-for="item in roomData" :key="item.id">
            <td>{{ item.name }}</td>
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
      id="rooms-modal"
      class="modal fade"
      tabIndex="-1"
      aria-labelledby="newsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newsModalLabel">
              {{ isUpdate ? '編輯房型' : '建立新房型' }}
            </h1>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="modal.close"
            />
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    輸入圖片網址
                    <input
                      type="text"
                      v-model="tempData.imageUrl"
                      name="imageUrl"
                      id="image"
                      placeholder="請輸入圖片連結"
                      class="form-control"
                    />
                  </label>
                </div>
                <div class="form-group mb-2">
                  <label class="w-100">
                    輸入圖片清單網址
                    <div
                      class="flex flex-column gap-2 mb-1"
                      v-for="(img, idx) in tempData.imageUrlList"
                      :key="idx"
                    >
                      <input
                        type="text"
                        :name="`imageUrl-${idx}`"
                        :id="`image-${idx}`"
                        placeholder="請輸入圖片連結"
                        class="form-control"
                        v-model="tempData.imageUrlList[idx]"
                      />
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="() => tempData.imageUrlList.push('')"
                    >
                      新增清單
                    </button>
                    <button
                      v-if="tempData.imageUrlList.length > 1"
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="() => tempData.imageUrlList.pop('')"
                    >
                      移除清單
                    </button>
                  </label>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="form-group mb-2">
                  <label class="w-100" for="title">
                    標題
                    <input
                      v-model="tempData.name"
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
                      v-model="tempData.description"
                      type="text"
                      id="description"
                      name="description"
                      placeholder="請輸入文章描述"
                      class="form-control"
                    />
                  </label>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    <div class="form-group mb-2">
                      <label class="w-100" for="areaInfo">
                        坪數
                        <input
                          v-model="tempData.areaInfo"
                          type="text"
                          id="areaInfo"
                          name="areaInfo"
                          placeholder="請輸入坪數"
                          class="form-control"
                        />
                      </label>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group mb-2">
                      <label class="w-100" for="bedInfo">
                        床數
                        <input
                          v-model="tempData.bedInfo"
                          type="text"
                          id="bedInfo"
                          name="bedInfo"
                          placeholder="請輸入床數"
                          class="form-control"
                        />
                      </label>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group mb-2">
                      <label class="w-100" for="maxPeople">
                        最大人數
                        <input
                          v-model="tempData.maxPeople"
                          type="number"
                          id="maxPeople"
                          name="maxPeople"
                          placeholder="請輸入最大人數"
                          class="form-control"
                        />
                      </label>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group mb-2">
                      <label class="w-100" for="price">
                        價格
                        <input
                          v-model="tempData.price"
                          type="number"
                          id="price"
                          name="price"
                          placeholder="請輸入價格"
                          class="form-control"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group mb-2">
                  <label class="w-100">
                    房間格局
                    <div class="d-flex flex-column gap-2 mb-1">
                      <div
                        class="d-flex align-items-center gap-3"
                        v-for="(layout, idx) in tempData.layoutInfo"
                        :key="idx"
                      >
                        <input
                          v-model="tempData.layoutInfo[idx].title"
                          type="text"
                          :id="`layout-${idx}`"
                          :name="`layout-${idx}`"
                          placeholder="請輸入格局"
                          class="form-control"
                        />
                        <input
                          v-model="tempData.layoutInfo[idx].isProvide"
                          type="checkbox"
                          :id="`layout-checked-${idx}`"
                          :name="`layout-checked-${idx}`"
                          class="form-check-input"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="
                        () =>
                          tempData.layoutInfo.push({
                            title: '',
                            isProvide: false,
                          })
                      "
                    >
                      新增清單
                    </button>
                    <button
                      v-if="tempData.layoutInfo.length > 1"
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="() => tempData.layoutInfo.pop('')"
                    >
                      移除清單
                    </button>
                  </label>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group mb-2">
                  <label class="w-100">
                    房內設備
                    <div class="d-flex flex-column gap-2 mb-1">
                      <div
                        class="d-flex align-items-center gap-3"
                        v-for="(facility, idx) in tempData.facilityInfo"
                        :key="idx"
                      >
                        <input
                          v-model="tempData.facilityInfo[idx].title"
                          type="text"
                          :id="`facility-${idx}`"
                          :name="`facility-${idx}`"
                          placeholder="請輸入設備"
                          class="form-control"
                        />
                        <input
                          v-model="tempData.facilityInfo[idx].isProvide"
                          type="checkbox"
                          :id="`facility-checked-${idx}`"
                          :name="`facility-checked-${idx}`"
                          class="form-check-input"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="
                        () =>
                          tempData.facilityInfo.push({
                            title: '',
                            isProvide: false,
                          })
                      "
                    >
                      新增清單
                    </button>
                    <button
                      v-if="tempData.facilityInfo.length > 1"
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="() => tempData.facilityInfo.pop('')"
                    >
                      移除清單
                    </button>
                  </label>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group mb-2">
                  <label class="w-100">
                    備品提供
                    <div class="d-flex flex-column gap-2 mb-1">
                      <div
                        class="d-flex align-items-center gap-3"
                        v-for="(amenity, idx) in tempData.amenityInfo"
                        :key="idx"
                      >
                        <input
                          v-model="tempData.amenityInfo[idx].title"
                          type="text"
                          :id="`amenity-${idx}`"
                          :name="`amenity-${idx}`"
                          placeholder="請輸入備品"
                          class="form-control"
                        />
                        <input
                          v-model="tempData.amenityInfo[idx].isProvide"
                          type="checkbox"
                          :id="`amenity-checked-${idx}`"
                          :name="`amenity-checked-${idx}`"
                          class="form-check-input"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="
                        () =>
                          tempData.amenityInfo.push({
                            title: '',
                            isProvide: false,
                          })
                      "
                    >
                      新增清單
                    </button>
                    <button
                      v-if="tempData.amenityInfo.length > 1"
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="() => tempData.amenityInfo.pop('')"
                    >
                      移除清單
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="modal.close"
            >
              關閉
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="setRoom(tempData)"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
    <ModalDelete
      :content="`${tempData.name}`"
      :closeModal="() => delModal.close()"
      :deleteMethod="() => deleteRoom(tempData)"
    />
  </div>
</template>

<style lang="scss" scoped>
.max-w-200px {
  max-width: 200px;
}
</style>