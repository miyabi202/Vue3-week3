import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';


const app = createApp({
  data(){
    return {
      apiUrl : 'https://vue3-course-api.hexschool.io/v2',
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      const api = `${this.apiUrl}/admin/signin`;

      axios.post(api, this.user)
        .then((res) => {
          const { expired, token } = res.data;
          document.cookie = `yanaToken=${token};expires=${new Date(expired)}; path=/`;
          window.location = 'index.html';
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    }
  }
});
app.mount('#app')