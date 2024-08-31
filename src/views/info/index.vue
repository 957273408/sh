<script setup lang="ts" name="info">
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

function toKd(query) {
  router.push({
    name: "kd"
  });
}
function toAz(query) {
  router.push({
    name: "az"
  });
}
</script>

<template>
  <div
    class="demo-content relative px-[12px] bg-scroll size-full bg-contain relative"
    style="background-image: url(../../../public/info.png)"
  >
    <div
      class="flex justify-center items-center flex-col top-[372px] absolute w-[100%]"
    >
      <button
        class="w-[353px] h-[57px] leading-[57px] text-[#ffffff] text-[25px] rounded-md bg-[#826536]"
        @click="toKd"
      >
        代寄快递
      </button>
      <button
        class="w-[353px] h-[57px] leading-[57px] text-[#ffffff] text-[25px] rounded-md bg-[#826536] mt-[100px]"
        @click="toAz"
      >
        安置信息
      </button>
    </div>
  </div>
</template>
