const apiURL = "http://127.0.0.1:3000";

const app = Vue.createApp({
  data() {
    return {
      buffets: [],
      searchText: "",
      screen: "buffets",
      current_buffet: {},
      modal: true,
      checkFeedback: ""
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
      responseBuffet = await fetch(`${apiURL}/api/v1/buffets/${id}/`);
      responseEvents = await fetch(`${apiURL}/api/v1/buffets/${id}/events/`);
      buffetData = await responseBuffet.json();
      eventsData = await responseEvents.json();
      this.current_buffet = buffetData;
      this.current_buffet.events = eventsData;
    },

    backToBuffets() {
      this.screen = "buffets";
    },
  },
});

app.mount("#app");
