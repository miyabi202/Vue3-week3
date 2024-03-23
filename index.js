import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'yana',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  methods: {
    checkAdmin() {
      const api = `${this.apiUrl}/api/user/check`;
      axios.post(api)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    getData() {
      const api = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;

      axios.get(api)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    updateProduct() {
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      if(!this.isNew) {
        api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](api, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    openModal(status, item) {
      if(status === 'new'){
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (status === 'edit'){
        this.tempProduct = {...item};
        this.isNew = false;
        productModal.show();
      } else if (status === 'delete') {
        this.tempProduct = {...item};
        delProductModal.show();
      }
    },
    delProduct() {
      const api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(api)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
  mounted() {
    //取出 token
    //這裡通過讀取 document.cookie，使用正則表達式從中提取出名為 yanaToken 的 cookie 的值。這個 cookie 可能包含了用於身份驗證的 token。
   //提取出的 token 存儲在變數 token 中。
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)yanaToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();

    //鎖定產品 modal
    /****鎖定產品 modal：

最後，使用 Bootstrap 的 Modal 類，將產品 modal 和刪除產品 modal 鎖定在畫面上，禁用了鍵盤事件和點擊 modal 以外的區域關閉 modal 的功能。
總的來說，這段程式碼初始化了一些重要的操作，包括設置身份驗證所需的 token，執行一些初始化的驗證或其他操作，以及鎖定 modal，確保用戶無法透過鍵盤事件或點擊 modal 以外的區域來關閉 modal。 */
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: 'static'
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static'
    });
  },
});
app.mount('#app')