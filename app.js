const apiURL = "http://127.0.0.1:3000";

const app = Vue.createApp({
  data() {
    return {
      buffets: [],
      searchText: "",
      screen: "buffets",
      current_buffet: {},
    };
  },

  async mounted() {
    this.listResult = await this.getBuffets();
  },

  computed: {
    listResult() {
      if (this.searchText) {
        return this.buffets.filter((buffet) => {
          return buffet.buffet_name
            .toLowerCase()
            .includes(this.searchText.toLowerCase());
        });
      } else {
        return this.buffets;
      }
    },
  },

  methods: {
    async getBuffets() {
      response = await fetch(`${apiURL}/api/v1/buffets/`);
      data = await response.json();
      this.buffets = data;
    },

    async getCurrentBuffet(id) {
      this.screen = "buffet-details";
      response = await fetch(`${apiURL}/api/v1/buffets/${id}/`);
      data = await response.json();
      this.current_buffet = data;
    },
  },
});

app.mount("#app");
