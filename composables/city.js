export function useCity() {
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
  const regionData = ref([...cityData.value[0].region]);
  // 地址資料
  const addressData = ref({
    city: cityData.value[0].name,
    address: '',
    zipcode: '',
  });
  /**
   * 表單更換城市
   */
  const changeCity = (e) => {
    const name = e.target.value;
    regionData.value = cityData.value.filter(
      (city) => city.name === name
    )[0].region;
    addressData.value.zipcode = regionData.value[0].value;
  };
  /**
   * 地址重組
   */
  const formatAddress = computed(() => {
    const region = regionData.value.filter(
      (item) => item.value === addressData.value.zipcode
    )[0]?.name;
    return addressData.value.city + region + addressData.value.address;
  });

  return {
    cityData,
    regionData,
    addressData,
    changeCity,
    formatAddress,
  };
}
