import Swal from 'sweetalert2';
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      swalFire,
    },
  };
});

function swalFire({ icon, title }) {
  Swal.fire({
    position: 'center',
    icon,
    title,
    showConfirmButton: false,
    timer: 1500,
  });
}
