<script setup lang="ts" name="info">
     import eRunCalendar from "@/components/e-run-calendar/e-run-calendar.vue"
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useCascaderAreaData } from "@vant/area-data";

const router = useRouter();
const xb = ref("男");
const lx = ref("箱子");
const username = ref("");
const selectOptionsArr = ref( [30, 0, 0, 0])
const birthday = ref('')

const selectDate = (e)=>{
  birthday.value=e
}

const showGxPicker = ref(false);
const gxValue = ref("");
const getName = ref("");
const gxColumns = [
  { text: "父亲", value: "先考x府君" },
  { text: "母亲", value: "先妣x孺人" },
  { text: "爷爷", value: "祖考x府君" },
  { text: "奶奶", value: "祖妣x孺人" },
  { text: "外公", value: "外祖考x府君" },
  { text: "外婆", value: "外祖妣x孺人" },
  { text: "太爷", value: "曾祖考x府君" },
  { text: "太奶", value: "曾祖妣x孺人" },
  { text: "太姥爷", value: "外曾祖考x府君" },
  { text: "太姥姥", value: "外曾祖妣x孺人" },
  { text: "三代宗亲", value: "x氏堂中先远三代宗亲" }
];
const onGxConfirm = ({ selectedValues }) => {
  let selectedValue = selectedValues.join("");
  if (!selectedValue.includes("氏")) {
    gxValue.value = selectedValue.replace("x", getName.value);
  } else {
    gxValue.value = selectedValue.replace("x", getName.value.substring(0, 1));
  }
  showGxPicker.value = false;
};
const showSlPicker = ref(false);
const slColumns = [
  { text: "壹", value: "壹" },
  { text: "贰", value: "贰" },
  { text: "肆", value: "肆" },
  { text: "陆", value: "陆" },
  { text: "捌", value: "捌" },
  { text: "拾", value: "拾" }
];
const sl = ref("");
const onSlConfirm = ({ selectedValues }) => {
  sl.value = selectedValues.join("");
  showSlPicker.value = false;
};

const show = ref(false);
const showCalendar = ref(false);

const minDate = new Date(1950, 0, 1);
const maxDate = new Date();
const currentDate = ref([
  maxDate.getFullYear(),
  maxDate.getUTCMonth() + 1,
  maxDate.getDate()
]);
const currentTime = ref([maxDate.getHours(), maxDate.getMinutes()]);

const fieldValue = ref("");
const cascaderValue = ref("");
const options = useCascaderAreaData();
const onFinish = ({ selectedOptions }) => {
  show.value = false;
  fieldValue.value = selectedOptions.map(option => option.text).join("");
};
</script>

<template>
  <div
    class="demo-content relative px-[12px] bg-scroll size-full bg-contain relative"
    style="background-image: url(../../../public/xx.png)"
  >
    <div
      class="flex justify-center items-center flex-col top-[118px] absolute w-[100%] p-[20px]"
    >
      <div class="title text-[46px] text-[#417857] font-bold mb-[50px]">
        填写信息
      </div>
      <van-form class="w-[100%]" label-align="top" @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="姓名"
            label="姓名"
            placeholder="姓名"
          />
          <van-field name="radio" label="性别">
            <template #input>
              <van-radio-group v-model="xb" direction="horizontal">
                <van-radio name="男">男</van-radio>
                <van-radio name="女">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="fieldValue"
            is-link
            readonly
            label="地区"
            placeholder="请选择所在地区"
            @click="show = true"
          />
          <van-popup v-model:show="show" round position="bottom">
            <van-cascader
              v-model="cascaderValue"
              title="请选择所在地区"
              :options="options"
              @close="show = false"
              @finish="onFinish"
            />
          </van-popup>

          <van-field
            v-model="message"
            rows="1"
            autosize
            label="街道信息"
            type="textarea"
            placeholder="请输入街道信息"
            show-word-limit
          />

          <van-field
            v-model="sms"
            rows="3"
            center
            clearable
            label="智能识别"
            placeholder="粘贴地址信息自动识别填写"
          >
            <template #button>
              <van-button size="small" type="primary">识别</van-button>
            </template>
          </van-field>

          <van-field
            v-model="birthday"
            is-link
            readonly
            name="calendar"
            label="农历出生年/月/日/时"
            placeholder="点击选择日期"
            @click="showCalendar = true"
          />
          <e-run-calendar ref="betterCalendarRef" :showCalendar="showCalendar" @confirm="selectDate" :isHourShow="true"
                @cancel="()=>{
                  showCalendar = false
                }" :selectOptions="selectOptionsArr"></e-run-calendar>
          <!-- <van-popup v-model:show="showCalendar" round position="bottom">
            <van-picker-group
              v-model:show="showCalendar"
              title="农历出生年/月/日/时"
              :tabs="['选择日期', '选择时间']"
              @confirm="onConfirm"
              @cancel="onCancel"
            >
              <van-date-picker
                v-model="currentDate"
                :min-date="minDate"
                :max-date="maxDate"
              />
              <van-time-picker v-model="currentTime" />
            </van-picker-group>
          </van-popup> -->

          <van-field
            v-model="getName"
            name="收件人姓名"
            label="收件人姓名"
            placeholder="收件人姓名"
          />
          <van-field
            v-model="gxValue"
            is-link
            readonly
            label="收件人与寄件人关系"
            placeholder="选择收件人与寄件人关系"
            @click="
              () => {
                if (getName) {
                  showGxPicker = true;
                }
              }
            "
          />
          <van-popup v-model:show="showGxPicker" round position="bottom">
            <van-picker
              :columns="gxColumns"
              @cancel="showGxPicker = false"
              @confirm="onGxConfirm"
            />
          </van-popup>
          <van-field name="radio" label="类型">
            <template #input>
              <van-radio-group v-model="lx" direction="horizontal">
                <van-radio name="箱子">箱子</van-radio>
                <van-radio name="库">库</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            v-model="sl"
            is-link
            readonly
            label="数量"
            placeholder="选择数量"
            @click="showSlPicker = true"
          />
          <van-popup v-model:show="showSlPicker" round position="bottom">
            <van-picker
              :columns="slColumns"
              @cancel="showSlPicker = false"
              @confirm="onSlConfirm"
            />
          </van-popup>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
