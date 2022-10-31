<template>
  <v-dialog v-model="show" width="300" persistent>
    <v-card :dark="dark" :light="light">
      <v-card-title>
        <v-icon class="mr-2">{{ icon }}</v-icon> <span>{{ title }}</span>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">{{ message }}</p>
        <v-card-actions>
          <v-btn
            depressed
            rounded
            :small="small"
            class="primary font-weight-bold text-capitalize"
            @click="close"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "VConfirmation",
  props: {
    dark: Boolean,
    light: Boolean,
    small: Boolean,
  },
  data() {
    return {
      show: false,
      resolve: () => null,
      reject: () => null,
      message: "",
      icon: "mdi-information",
      title: "Alert",
    };
  },
  methods: {
    close() {
      this.resolve(null);
      this.show = false;
      this.message = "";
      this.icon = "mdi-information";
      this.title = "Alert";
    },
    alert(setup = {}) {
      return new Promise((resolve, reject) => {
        this.message = setup.message;
        this.icon = setup.icon || this.icon;
        this.title = setup.title || this.title;
        this.show = true;
        this.resolve = resolve;
        this.reject = reject;
      });
    },
  },
  mounted() {
    window.alert = this.alert;
  },
};
</script>
