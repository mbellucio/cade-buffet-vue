const apiURL = "http://127.0.0.1:3000";
let numberToCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const app = Vue.createApp({
  data() {
    return {
      buffets: [],
      searchText: "",
      screen: "buffets",
      current_buffet: {},
      modal: false,
      checkSituation: "",
      checkFeedback: "",
      checkErrors: [],
      inputs: [],
      alert: "",
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
      this.resetAlert()
      let response = await fetch(`${apiURL}/api/v1/buffets/`);
      data = await response.json();
      this.buffets = data;
    },

    async getCurrentBuffet(id) {
      try {
        this.resetAlert()
        this.screen = "buffet-details";
        responseBuffet = await fetch(`${apiURL}/api/v1/buffets/${id}/`);
        responseEvents = await fetch(`${apiURL}/api/v1/buffets/${id}/events/`);
        buffetData = await responseBuffet.json();
        eventsData = await responseEvents.json();
        this.current_buffet = buffetData;
        this.current_buffet.events = eventsData;
        this.current_buffet.events.forEach((event) => {
          this.inputs.push({ bookingDate: "", guestNumber: 0 });
          this.checkErrors.push({ error: "" });
        });
      } catch (error) {
        this.screen = "buffets";
        console.log(error);
        this.alert = "Este buffet não está disponível no momento...";
      }
    },

    resetAlert() {
      this.alert = "";
    },

    backToBuffets() {
      this.screen = "buffets";
    },

    closeModal() {
      this.modal = false;
    },

    async checkAvailability(id, index) {
      const { bookingDate, guestNumber } = this.inputs[index];
      try {
        this.checkErrors[index].error = "";
        const params = new URLSearchParams({
          booking_date: bookingDate,
          guest_number: guestNumber,
        });
        response = await fetch(`${apiURL}/api/v1/events/${id}?${params}`);
        data = await response.json();
        this.modal = true;
        if (data.error) {
          this.checkFeedback = data.error;
          this.checkSituation = "Indisponível";
          return;
        }
        this.checkSituation = "Disponível";
        this.checkFeedback = `Preço estimado de ${
          data.event
        } para ${guestNumber} pessoas: ${numberToCurrency.format(
          data.estimated_price
        )}`;
      } catch (error) {
        this.checkErrors[index].error = "Preencha com dados válidos";
      }
    },
  },
});

app.mount("#app");
