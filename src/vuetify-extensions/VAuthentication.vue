<template>
  <v-dialog v-model="showDialog" width="300" persistent>
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">{{ icon }}</v-icon>
        <span>{{ title }}</span>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p>{{ message }}</p>
        <v-form ref="authenticationForm" @submit.prevent="callAuthenticator">
          <v-password-field
            v-model="password"
            label="Enter your password"
            :rules="[requiredRule]"
            prepend-inner-icon="mdi-lock-outline"
            solo
            v-bind="$attrs"
          />
          <v-btn
            type="submit"
            class="primary white--text font-weight-bold text-capitalize"
            elevation="0"
            :loading="loading"
          >
            Authenticate
          </v-btn>
          <p class="font-weight-bold red--text">{{ error }}</p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { IVForm } from "@/types";
import { Vue, Component, Ref, Watch } from "vue-property-decorator";
import VPasswordField from "@/vuetify-extensions/VPasswordField.vue";
import { requiredRule } from "@/utils/rules";

@Component({
  inheritAttrs: true,
  components: {
    VPasswordField,
  },
})
export default class Authentication extends Vue {
  authenticator: ((password: string) => Promise<any>) | null = null;
  loading = false;
  resolve: Function | null = null;
  reject: Function | null = null;
  icon = "mdi-account-question";
  message = "";
  title = "Authenticate";
  showDialog = false;
  password = "";
  error = "";

  @Ref()
  authenticationForm!: IVForm;

  requiredRule = requiredRule;

  close() {
    this.showDialog = false;
    this.resolve!(false);
  }

  async callAuthenticator() {
    this.error = "";
    if (!this.authenticationForm.validate()) return;
    try {
      this.loading = true;
      await this.authenticator!(this.password);
      this.loading = false;
      this.showDialog = false;
      this.resolve!(true);
    } catch (e) {
      this.loading = false;
      this.reject!(e)
    }
  }

  async authenticate(authObject: IAuthenticateObject): Promise<boolean> {
    this.message = authObject.message || this.message;
    this.icon = authObject.icon || this.icon;
    this.title = authObject.title || this.title;
    this.authenticator = authObject.authenticator;
    this.showDialog = true;
    return new Promise<boolean>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  @Watch("showDialog")
  onShowDialogChange() {
    if (this.showDialog) return;
    this.message = "";
    this.title = "Authenticate";
    this.icon = "mdi-account-question";
    this.authenticator = null;
    this.authenticationForm.reset();
    this.password = "";
  }

  mounted() {
    window.authenticate = this.authenticate;
  }
}
</script>
