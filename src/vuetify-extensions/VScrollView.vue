<template>
  <div ref="container">
    <v-container align-center v-if="processedData.length == 0 && !loading.loadItems">
      <slot name="empty-state">
        <v-empty-state title="List Empty" icon="list" />
      </slot>
    </v-container>
    <div ref="scrollView" v-else>
      <component :is="component" v-if="processedData.length > 0" v-bind="$attrs">
        <slot
          v-for="(item, index) in processedData"
          :item="item"
          :index="index"
        />
      </component>
      <center class="py-5">
        <v-skeleton-loader
          type="list-item-avatar-three-line@5"
          class="text-left"
          v-if="loading.loadItems && data.length == 0"
        />
        <v-progress-circular
          indeterminate
          v-if="loading.loadItems && data.length > 0"
          color="primary"
        />
      </center>
    </div>
  </div>
</template>

<script lang="ts">
import JackocoinsNetworkMixin from "@/mixins/JackocoinsNetworkMixin";
import { throwsNetworkError } from "@/utils/http/NetworkManagerMixin";
import VEmptyState from "@/vuetify-extensions/VEmptyState.vue";
import {
  Mixins,
  Component,
  Prop,
  Ref,
  PropSync,
  Watch,
} from "vue-property-decorator";

type Loader = (
  page: number,
  size: number
) => Promise<{ hasNextPage: boolean; data: any[] }>;

@Component({
  inheritAttrs: true,
  components: {
    VEmptyState,
  },
})
export default class VScrollView extends Mixins(JackocoinsNetworkMixin) {
  @Prop({
    type: String,
    default: "div",
  })
  component!: string;

  @Prop({
    type: Array,
    default: () => [],
  })
  rules!: Array<(item: any, index?: number) => boolean>;

  @Prop({
    type: Function,
    default: () => null,
  })
  loader!: Loader;

  @Prop({
    type: Boolean,
    default: true,
  })
  scrollWithDocument!: boolean;

  @Prop({
    type: Number,
    default: 20,
  })
  size!: number;

  @Prop({
    type: Function,
  })
  reducer?: (prev: any, current: any) => any

  @PropSync("refresh", {
    type: Boolean,
    default: false,
  })
  refreshSync!: boolean;

  @Ref()
  container!: HTMLElement;

  content: Window | HTMLElement | null = null;
  data: any[] = [];
  hasNextPage!: boolean;
  page = 1;

  get processedData() {
    let value = this.data.filter((item, index) => {
      let flag = true;
      for (const rule of this.rules) {
        flag = flag && rule(item, index) === true;
      }
      return flag;
    });
    if(this.reducer !== undefined) value = value.reduce(this.reducer, []);
    return value;
  }

  @throwsNetworkError()
  async loadItems(refresh: boolean = false) {
    if (refresh) {
      this.page = 1;
      this.data = [];
    }
    const response = await this.loader(this.page, this.size);
    this.data.push(...response.data);
    this.hasNextPage = response.hasNextPage;
    this.page++;
  }

  async loadMoreData(event: Event | TouchEvent) {
    this.content!.removeEventListener("scroll", this.loadMoreData);
    this.content!.removeEventListener("touchmove", this.loadMoreData);
    var target = this.scrollWithDocument
      ? document.scrollingElement
      : event.target;
    const scrollHeight = (target as HTMLElement).scrollHeight;
    const clientHeight = (target as HTMLElement).clientHeight;
    const scrollTop = (target as HTMLElement).scrollTop;
    if (scrollHeight <= clientHeight + scrollTop + 100 && this.hasNextPage) {
      await this.loadItems();
    }
    this.content!.addEventListener("scroll", this.loadMoreData);
    this.content!.addEventListener("touchmove", this.loadMoreData);
  }

  @Watch("refresh")
  onRefreshChange() {
    if (this.refreshSync) {
      this.loadItems(this.refreshSync);
      this.refreshSync = false;
    }
  }

  mounted() {
    this.content = this.scrollWithDocument
      ? window
      : this.container.parentElement;
    this.content!.addEventListener("scroll", this.loadMoreData);
    this.content!.addEventListener("touchmove", this.loadMoreData);
    this.loadItems(true);
  }
  beforeDestroy() {
    this.content!.removeEventListener("scroll", this.loadMoreData);
    this.content!.removeEventListener("touchmove", this.loadMoreData);
  }
}
</script>
