import { defineStore } from 'pinia';
export const useBookingStore = defineStore('booking', () => {
  const roomData = ref({});
  const bookingData = ref({});
  const setRoomData = (data) => {
    roomData.value = data;
  };
  const getRoomData = () => {
    return roomData.value;
  };
  const setBookingData = (data) => {
    bookingData.value = data;
  };
  const getBookingData = () => {
    return bookingData.value;
  };
  return {
    setRoomData,
    getRoomData,
    setBookingData,
    getBookingData
  };
});
