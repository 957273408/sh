<script setup lang="ts" name="Demo">
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

function toInfo(query) {
  router.push({
    name: "info"
  });
}
</script>

<template>
  <div
    class="demo-content relative px-[12px] bg-scroll size-full bg-contain"
    style="background-image: url(../../../public/indexbg.png)"
  >
    <button
      class="absolute w-[275px] h-[57px] leading-[57px] text-[#ffffff] bottom-[168px] left-[50%] translate-x-[-50%] text-[26px] rounded-md bg-[#826536]"
      @click="toInfo"
    >
      立即填写
    </button>
  </div>
</template>
