<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
const { $swalFire, $bsModal } = useNuxtApp();

const cookie = useCookie('auth');
const tempOrderData = ref({
  roomId: '65251f6095429cd58654bf12',
  checkInDate: '2023/06/18',
  checkOutDate: '2023/06/19',
  peopleNum: 2,
  userInfo: {
    address: {
      zipcode: 802,
      detail: '文山路23號',
    },
    name: 'Joanne Chen',
    phone: '0912345678',
    email: 'example@gmail.com',
  },
});


const {
  cityData,
  regionData,
  addressData,
  changeCity,
  regionInit,
  formatAddress,
} = useCity();
const ordersData = ref([]);
const roomsData = ref([]);
const modal = ref(null);
const delModal = ref(null);

const getOrderApi = () =>
  $fetch(`/api/v1/admin/orders/`, {
    method: 'GET',
    baseURL: 'https://freyja-wtj7.onrender.com/',
    headers: {
      Authorization: cookie.value,
    },
  });

const { data } = await useAsyncData('getOrders', () => getOrderApi());
const { data: roomsResult } = await useFetch(`/api/v1/admin/rooms/`, {
  method: 'GET',
  baseURL: 'https://freyja-wtj7.onrender.com/',
  headers: {
    Authorization: cookie.value,
  },
});
ordersData.value = data.value.result;
roomsData.value = roomsResult.value.result;

function userDataInit(userInfo) {
  const regex = /(.+市)(.+區)(.+)/;
  const addressArr = userInfo.address.detail.match(regex).slice(1);
  addressData.value = {
    city: addressArr[0],
    address: addressArr[2],
    zipcode: userInfo.address.zipcode,
  };
  regionInit();
}

/**
 * 取得消息
 */
const getOrders = async () => {
  const { result } = await getOrderApi();
  ordersData.value = result;
};

/**
 * 刪除消息
 */
const deleteOrder = async ({ _id }) => {
  try {
    const res = await $fetch(`/api/v1/admin/orders/${_id}`, {
      method: 'DELETE',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      headers: {
        Authorization: cookie.value,
      },
    });
    $swalFire({ title: '成功刪除', icon: 'success' });
    getOrders();
  } catch (error) {
    $swalFire({
      title: error.response?._data?.message || '刪除失敗',
      icon: 'error',
    });
  } finally {
    delModal.value.close();
  }
};

const formatDate = (date) => {
  const outPutDate = new Date(date);
  const year = outPutDate.getFullYear();
  const month = String(outPutDate.getMonth() + 1).padStart(2, '0');
  const day = String(outPutDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

const openModal = (data) => {
  modal.value.open();

  userDataInit(data.userInfo);

  tempOrderData.value = {
    ...data,
    checkInDate: formatDate(data.checkInDate),
    checkOutDate: formatDate(data.checkOutDate),
    roomId: data.roomId._id,
  };
};

const openDelModal = (data) => {
  delModal.value.open();
  if (data) {
    tempOrderData.value = { ...data };
  }
};


const updateOrder = async () => {
  const apiData = {
    roomId: tempOrderData.value.roomId,
    checkInDate: tempOrderData.value.checkInDate.replaceAll('-', '/'),
    checkOutDate: tempOrderData.value.checkOutDate.replaceAll('-', '/'),
    peopleNum: tempOrderData.value.peopleNum,
    userInfo: {
      address: {
        zipcode: addressData.value.zipcode,
        detail: formatAddress.value,
      },
      name: tempOrderData.value.userInfo.name,
      phone: tempOrderData.value.userInfo.phone,
      email: tempOrderData.value.userInfo.email,
    },
  };

  try {
    const res = await $fetch(
      `/api/v1/admin/orders/${tempOrderData.value._id}`,
      {
        method: 'PUT',
        baseURL: 'https://freyja-wtj7.onrender.com/',
        body: apiData,
        headers: {
          Authorization: cookie.value,
        },
      }
    );
    $swalFire({ title: '更新成功', icon: 'success' });
    // getNews();
  } catch (error) {
    $swalFire({
      title: error.response?._data?.message || '更新失敗',
      icon: 'error',
    });
    getOrders();
  } finally {
    modal.value.close();
  }
};

onMounted(() => {
  modal.value = $bsModal('#orders-modal');
  delModal.value = $bsModal('#delModal');
});
</script>

<template>
  <div>
    <div class="p-3">
      <h3>訂單列表</h3>
      <hr />
      <table class="table">
        <thead>
          <tr>
            <th scope="col">訂單編號</th>
            <th class="col" scope="col">預約人</th>
            <th class="col" scope="col">狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ordersData" :key="item.id">
            <td>{{ item._id }}</td>
            <td>{{ item.userInfo.name }}</td>
            <td>{{ item.status !== -1 ? '未取消' : '取消' }}</td>
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
      id="orders-modal"
      class="modal fade"
      tabIndex="-1"
      aria-labelledby="newsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newsModalLabel">編輯訂單</h1>
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
                    訂單編號
                    <div>{{ tempOrderData._id }}</div>
                  </label>
                </div>
                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    房型
                    <select
                      class="form-select"
                      name="room"
                      id="room"
                      v-model="tempOrderData.roomId"
                    >
                      <option
                        :value="room._id"
                        v-for="room in roomsData"
                        :key="room._id"
                      >
                        {{ room.name }}
                      </option>
                    </select>
                  </label>
                </div>

                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    入住
                    <input
                      v-model="tempOrderData.checkInDate"
                      type="date"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      class="form-control"
                    />
                  </label>
                </div>
                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    退房
                    <input
                      v-model="tempOrderData.checkOutDate"
                      type="date"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      class="form-control"
                    />
                  </label>
                </div>
                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    人數
                    <input
                      v-model="tempOrderData.peopleNum"
                      type="number"
                      id="title"
                      name="title"
                      placeholder="請輸入人數"
                      class="form-control"
                    />
                  </label>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    預約人
                    <input
                      v-model="tempOrderData.userInfo.name"
                      type="text"
                      id="title"
                      name="title"
                      placeholder="請輸入預約人"
                      class="form-control"
                    />
                  </label>
                </div>
                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    信箱
                    <input
                      v-model="tempOrderData.userInfo.email"
                      type="text"
                      id="email"
                      name="email"
                      placeholder="請輸入信箱"
                      class="form-control"
                    />
                  </label>
                </div>
                <div class="form-group mb-2">
                  <label class="w-100" for="image">
                    手機電話
                    <input
                      v-model="tempOrderData.userInfo.phone"
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="請輸入手機電話"
                      class="form-control"
                    />
                  </label>
                </div>
                <hr />
                <div class="form-group mb-2">
                  <div>
                    <div class="d-flex gap-2 mb-2">
                      <select
                        @change="changeCity"
                        v-model="addressData.city"
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
                    <input
                      v-model="addressData.address"
                      id="address"
                      type="text"
                      name="地址"
                      class="form-control p-4 rounded-3"
                      placeholder="請輸入詳細地址"
                    />
                  </div>
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
            <button type="button" class="btn btn-primary" @click="updateOrder">
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
    <ModalDelete
      :content="`${tempOrderData._id}`"
      :closeModal="() => delModal.close()"
      :deleteMethod="() => deleteOrder(tempOrderData)"
    />
  </div>
</template>

<style lang="scss" scoped>
.max-w-200px {
  max-width: 200px;
}
</style>
