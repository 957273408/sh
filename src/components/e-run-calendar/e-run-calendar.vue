<template>
  <div class="calendar">
    <div class="content" @tap.stop>
      <!-- <picker-div :value="selectValue" @change="bindChange">
          <picker-div-column>
            <div class="item" v-for="(item, index) in years" :key="index">{{ item }}年</div>
          </picker-div-column>
          <picker-div-column>
            <div class="item" v-for="(item, index) in months" :key="index">{{ item }}</div>
          </picker-div-column>
          <picker-div-column>
            <div class="item" v-for="(item, index) in days" :key="index">{{ item }}</div>
          </picker-div-column>
          <picker-div-column v-if="isHourShow">
            <div class="item" v-for="(item, index) in lunarHour" :key="index">{{
              isActive ? item.solar : item.label
            }}</div>
          </picker-div-column>
        </picker-div> -->

      <van-popup v-model:show="show" round position="bottom">
        <van-cascader v-model="cascaderValue" title="农历出生年/月/日/时" :options="years" @close="cancel" @change="bindChange"
          @finish="onFinish" />
      </van-popup>
      <!-- <div class="bottom" v-if="isSwitch">
          <div class="left" @click="cancel">取消</div>
          <div class="right" @click="sure">确定</div>
        </div> -->
    </div>
  </div>
</template>

<script>
import conversion from './calendar.js'
import lunarHour from './information.js'
export default {
  name: 'e-run-calendar',
  data() {
    return {
      oldYear: 1950, // 最大年份
      type: 'lunar', // lunar农历，solar公历
      isActive: false, // true公历
      showData: '', // 显示数据
      show: false,
      checked: true,
      years: [],
      months: [],
      days: [],
      lunarHour: [],
      cascaderValue: [],
      date: '',
      hour: '',
      leap_month: 0, // 1为闰月0为非闰月
      sureYear: '1998', // 默认弹出显示年份
      sureMonth: '1', // 默认弹出显示月份
      selectValue: [30, 0, 0, 0], // 默认弹出选择的状态1998-10-16 0
      showYear: '',
      showMonth: '',
      nextFinally: true,
    }
  },
  props: {
    showCalendar: {
      type: Boolean,
      default: () => false,
    },
    isHourShow: {
      type: Boolean,
      default: false,
    },
    isSwitch: {
      type: Boolean,
      default: true,
    },
    selectOptions: {
      type: Array,
      default: () => [30, 0, 0, 0],
    },
  },
  watch: {
    showCalendar(newVal, oldVal) {
      if (newVal) {
        this.getTime()
        this.show = true
      }

    },
    show(newVal, oldVal) {
      if (!newVal) {
        console.log(1111111111)
        this.cancel()
      }

    },
    selectOptions(newVal, oldVal) {
      this.selectValue = newVal
    },
  },
  created() {
    this.getTime()
  },
  onHide() {
  },
  mounted() { },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    // 提交
    onFinish(e) {
      console.log(e)
      let data = e.selectedOptions.map(item=>item.text).join('')
      this.$emit('confirm',data)
      this.show=false
    },
    // 进来获取公历的1990-02-10 10,初始化
    getTime() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      this.years = []
      this.days = []
      this.months = []
      for (let i = this.oldYear; i <= date.getFullYear(); i++) {
        if (this.isActive) {
          this.years.push({
            text: i,
            value: i,
            children: []
          })
        } else {
          this.years.push({
            text: conversion.toChinaYear(i),
            value: i,
            children: []
          })
        }
      }
      console.log(this.sureYear, this.sureMonth, this.selectValue, 'this.sureYear, this.sureMonth, this.selectValue')
      if (this.isActive) {
        this.getsolarMonthDays(this.sureYear, this.sureMonth, this.selectValue)
      } else {
        this.getlunarMonthDays(this.sureYear, this.sureMonth, this.selectValue)
      }
      this.lunarHour = lunarHour.lunarHour

    },
    bindChange: function (e) {
      console.log(e);
      const val = e.selectedOptions
      let year = val[0].value,
        month = val[1]?.value.split(',')[1] ?? 0 + 1;
      this.days = []
      this.months = []
      // this.selectValue = e.value
      // this.nextFinally = false
      // 公历返回每个月天数
      this.getlunarMonthDays(year, month)
      console.log(this.days)
      let index = this.years.findIndex(item => item.value === val[0].value)
      this.years[index].children = this.months
      let mindex = this.months.findIndex(item => item.value === val[1].value)
      this.years[index].children[mindex].children = this.days
    },

    // D=>DD,M=>MM,日，月转换 1=>01
    coverTo(num) {
      return num < 10 ? '0' + num : num
    },
    // 获取公历的月份和天数
    // 获取农历的月份和天数
    getlunarMonthDays(year, month = 1) {
      let leap_month = conversion.leapMonth(year)
      // 返回农历 闰月没有就返回0
      for (let i = 1; i <= 12; i++) {
        this.months.push(
          {
            text: conversion.toChinaMonth(i),
            value: year + ',' + i,
            children: []
          }
        )
        if (i == leap_month) {
          this.months.push(
            {
              text: '闰' + conversion.toChinaMonth(i),
              value: year + "," + i,
              children: []
            })
        }
      }
      // 农历返回天数
      // **leapMonth 返回闰月 conversion.leapMonth(year)
      // **monthDays 返回非闰月的天数
      // **leapDays 返回闰月的天数
      if (
        conversion.leapMonth(year) != 0 &&
        (conversion.leapMonth(year) == month || month - 1 == conversion.leapMonth(year))
      ) {
        for (let i = 1; i <= conversion.leapDays(year, conversion.leapMonth(year)); i++) {
          this.days.push(
            {
              text: conversion.toChinaDay(i),
              value: year + "," + month + "," + i,
              children: [
                {
                  value:year + "," + month + "," + i+','+ '24',
                  solar: '未知',
                  text: '未知',
                },
                {
                  value:year + "," + month + "," + i+','+ '0',
                  solar: '0点',
                  text: '0时子时',
                },
                {
                  value:year + "," + month + "," + i+','+ '1',
                  solar: '1点',
                  text: '1时丑时',
                },
                {
                  value:year + "," + month + "," + i+','+ '2',
                  solar: '2点',
                  text: '2时丑时',
                },
                {
                  value:year + "," + month + "," + i+','+ '3',
                  solar: '3点',
                  text: '3时寅时',
                },
                {
                  value:year + "," + month + "," + i+','+ '4',
                  solar: '4点',
                  text: '4时寅时',
                },
                {
                  value:year + "," + month + "," + i+','+ '5',
                  solar: '5点',
                  text: '5时卯时',
                },
                {
                  value:year + "," + month + "," + i+','+ '6',
                  solar: '6点',
                  text: '6时卯时',
                },
                {
                  value:year + "," + month + "," + i+','+ '7',
                  solar: '7点',
                  text: '7时辰时',
                },
                {
                  value:year + "," + month + "," + i+','+ '8',
                  solar: '8点',
                  text: '8时辰时',
                },
                {
                  value:year + "," + month + "," + i+','+ '9',
                  solar: '9点',
                  text: '9时巳时',
                },
                {
                  value:year + "," + month + "," + i+','+ '10',
                  solar: '10点',
                  text: '10时巳时',
                },
                {
                  value:year + "," + month + "," + i+','+ '11',
                  solar: '11点',
                  text: '11时午时',
                },
                {
                  value:year + "," + month + "," + i+','+ '12',
                  solar: '12点',
                  text: '12时午时',
                },
                {
                  value:year + "," + month + "," + i+','+ '13',
                  solar: '13点',
                  text: '13时未时',
                },
                {
                  value:year + "," + month + "," + i+','+ '14',
                  solar: '14点',
                  text: '14时未时',
                },
                {
                  value:year + "," + month + "," + i+','+ '15',
                  solar: '15点',
                  text: '15时申时',
                },
                {
                  value:year + "," + month + "," + i+','+ '16',
                  solar: '16点',
                  text: '16时申时',
                },
                {
                  value:year + "," + month + "," + i+','+ '17',
                  solar: '17点',
                  text: '17时酉时',
                },
                {
                  value:year + "," + month + "," + i+','+ '18',
                  solar: '18点',
                  text: '18时酉时',
                },
                {
                  value:year + "," + month + "," + i+','+ '19',
                  solar: '19点',
                  text: '19时戌时',
                },
                {
                  value:year + "," + month + "," + i+','+ '20',
                  solar: '20点',
                  text: '20时戌时',
                },
                {
                  value:year + "," + month + "," + i+','+ '21',
                  solar: '21点',
                  text: '21时亥时',
                },
                {
                  value:year + "," + month + "," + i+','+ '22',
                  solar: '22点',
                  text: '22时亥时',
                },
                {
                  value:year + "," + month + "," + i+','+ '23',
                  solar: '23点',
                  text: '23时子时',
                },
              ]
            }
          )
        }
      } else {
        let lunarMonth = ''
        if (conversion.leapMonth(year)) {
          lunarMonth = month < conversion.leapMonth(year) ? month : month - 1
        } else {
          lunarMonth = month
        }
        for (let i = 1; i <= conversion.monthDays(year, lunarMonth); i++) {
          this.days.push(
            {
              text: conversion.toChinaDay(i),
              value: year + "," + month + "," + i,
              children: [
                {
                  value:year + "," + month + "," + i+','+ '24',
                  solar: '未知',
                  text: '未知',
                },
                {
                  value:year + "," + month + "," + i+','+ '0',
                  solar: '0点',
                  text: '0时子时',
                },
                {
                  value:year + "," + month + "," + i+','+ '1',
                  solar: '1点',
                  text: '1时丑时',
                },
                {
                  value:year + "," + month + "," + i+','+ '2',
                  solar: '2点',
                  text: '2时丑时',
                },
                {
                  value:year + "," + month + "," + i+','+ '3',
                  solar: '3点',
                  text: '3时寅时',
                },
                {
                  value:year + "," + month + "," + i+','+ '4',
                  solar: '4点',
                  text: '4时寅时',
                },
                {
                  value:year + "," + month + "," + i+','+ '5',
                  solar: '5点',
                  text: '5时卯时',
                },
                {
                  value:year + "," + month + "," + i+','+ '6',
                  solar: '6点',
                  text: '6时卯时',
                },
                {
                  value:year + "," + month + "," + i+','+ '7',
                  solar: '7点',
                  text: '7时辰时',
                },
                {
                  value:year + "," + month + "," + i+','+ '8',
                  solar: '8点',
                  text: '8时辰时',
                },
                {
                  value:year + "," + month + "," + i+','+ '9',
                  solar: '9点',
                  text: '9时巳时',
                },
                {
                  value:year + "," + month + "," + i+','+ '10',
                  solar: '10点',
                  text: '10时巳时',
                },
                {
                  value:year + "," + month + "," + i+','+ '11',
                  solar: '11点',
                  text: '11时午时',
                },
                {
                  value:year + "," + month + "," + i+','+ '12',
                  solar: '12点',
                  text: '12时午时',
                },
                {
                  value:year + "," + month + "," + i+','+ '13',
                  solar: '13点',
                  text: '13时未时',
                },
                {
                  value:year + "," + month + "," + i+','+ '14',
                  solar: '14点',
                  text: '14时未时',
                },
                {
                  value:year + "," + month + "," + i+','+ '15',
                  solar: '15点',
                  text: '15时申时',
                },
                {
                  value:year + "," + month + "," + i+','+ '16',
                  solar: '16点',
                  text: '16时申时',
                },
                {
                  value:year + "," + month + "," + i+','+ '17',
                  solar: '17点',
                  text: '17时酉时',
                },
                {
                  value:year + "," + month + "," + i+','+ '18',
                  solar: '18点',
                  text: '18时酉时',
                },
                {
                  value:year + "," + month + "," + i+','+ '19',
                  solar: '19点',
                  text: '19时戌时',
                },
                {
                  value:year + "," + month + "," + i+','+ '20',
                  solar: '20点',
                  text: '20时戌时',
                },
                {
                  value:year + "," + month + "," + i+','+ '21',
                  solar: '21点',
                  text: '21时亥时',
                },
                {
                  value:year + "," + month + "," + i+','+ '22',
                  solar: '22点',
                  text: '22时亥时',
                },
                {
                  value:year + "," + month + "," + i+','+ '23',
                  solar: '23点',
                  text: '23时子时',
                },
              ]
            }
          )
        }

      }

      // if (e) {
      //   const val = e
      //   let year = val[0] + this.oldYear,
      //     month = val[1],
      //     day = val[2],
      //     hour = val[3] ? val[3] : 0,
      //     m = '',
      //     d = '',
      //     h = ''
      //   m = this.months[month]
      //   d = this.days[day]
      //   h = this.lunarHour[hour].value + '时'
      //   this.leap_month = month == leap_month && leap_month != 0 ? 1 : 0
      //   let lunarToMonth = this.coverTo(
      //     leap_month != 0 ? (month + 1 <= leap_month ? month + 1 : month) : month + 1
      //   )
      //   console.log(lunarToMonth, '获取当前月份')
      //   this.date = `${year}-${lunarToMonth}-${this.coverTo(day + 1)}`
      //   this.hour = hour - 1
      //   let showHour = this.isHourShow ? `${h}` : ''
      //   this.showData = `农历 ${conversion.toChinaYear(year)}年${m}${d} ${showHour == '24时' ? '' : showHour}`
      //   this.showYear = year
      //   this.showMonth = lunarToMonth
      // }
      setTimeout(e => {
        this.nextFinally = true
      }, 150)
    },
    // 切换公历<=>农历 回显以及切换 this.$refs.yourname.switchBtb(type,data),type:"lunar" or "solar", data:{date:"1992-02-10",hour:3,leap_month:"0",type:"lunar"}
    switchBtn(type, data) {
      // 农历公历互相联动切换
      if (this.type == type) {
        return false
      }
      if (type == 'lunar') {
        // 公历切换为农历
        let solarYear = this.selectValue[0] + this.oldYear // 公历年份
        let leapMonth = conversion.leapMonth(solarYear)
        let solarMonth = this.selectValue[1] + 1, // 公历年月份
          solarDay = this.selectValue[2] + 1, // 公历年日份
          hour = this.selectValue[3]
        let lunarDate = conversion.solar2lunar(solarYear, solarMonth, solarDay)
        this.sureYear = lunarDate.lYear // 默认弹出显示年份
        this.sureMonth = lunarDate.lMonth // 默认弹出显示月份
        this.leap_month = leapMonth != 0 ? 1 : 0
        let y = lunarDate.lYear - this.oldYear,
          m =
            this.leap_month == 0
              ? lunarDate.lMonth - 1
              : this.selectValue[1] < leapMonth
                ? lunarDate.lMonth - 1
                : lunarDate.lMonth,
          d = lunarDate.lDay - 1
        this.selectValue = [y, m, d, hour] // 默认弹出选择的状态1990-06-10 10
      } else {
        // 农历切换为公历
        let lunarYear = this.selectValue[0] + this.oldYear // 农历年份
        let leapMonth = conversion.leapMonth(lunarYear) // 一年中的几月份是闰月
        let lunarMonth =
          leapMonth == 0
            ? this.selectValue[1] + 1
            : this.selectValue[1] + 1 <= leapMonth
              ? this.selectValue[1] + 1
              : this.selectValue[1], // 农历年月份
          lunarDay = this.selectValue[2] + 1, // 农历年日份
          hour = this.selectValue[3]
        console.log(lunarYear,
          lunarMonth,
          lunarDay, '11111111')
        let lunarDate = conversion.lunar2solar(
          lunarYear,
          lunarMonth,
          lunarDay,
          leapMonth == this.selectValue[1] ? true : false
        )
        console.log(lunarDate, 'lunarDatelunarDate')
        this.sureYear = lunarDate.cYear // 默认弹出显示年份
        this.sureMonth = lunarDate.cMonth // 默认弹出显示月份
        this.leap_month = leapMonth != 0 ? 1 : 0
        let y = lunarDate.cYear - this.oldYear,
          m = lunarDate.cMonth - 1,
          d = lunarDate.cDay - 1
        this.selectValue = [y, m, d, hour] // 默认弹出选择的状态1990-06-10 10
        console.log(this.sureYear, this.sureMonth, this.selectValue, '00000')
      }
      this.isActive = type == 'solar' ? true : false
      this.type = type
      this.getTime()
    },
  },
}
</script>

<style scoped>
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 750rpx;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999999;
}

.u-mask-zoom {
  transform: scale(1, 1);
}

.calendar {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
}

.calendar .content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fff;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  animation: switchOpen 500ms linear;
}

@keyframes switchOpen {
  from {
    top: 100%;
  }

  to {
    top: 0%;
  }
}

.calendar .content .title {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100rpx;
  position: relative;
  border-bottom: 2rpx solid #e6e6e6;
  background-color: #ffffff;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  /* #ifdef MP-WEIXIN */
  margin-top: 0;
  /* #endif */
}

.calendar .content .title .switch {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  color: #a6a6a6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.calendar .content .title .switch .left,
.calendar .content .title .switch .right {
  font-size: 32rpx;
  display: inline-block;
  width: 100rpx;
  text-align: center;
}

.calendar .content .title .switch .bg {
  background-color: #1860ff;
  border-radius: 30px;
  height: 3px;
  width: 40rpx;
  position: absolute;
  bottom: 0px;
  z-index: 0;
}

.calendar .content .title .switch .active {
  color: #1860ff;
}

.calendar .content .title .switch .lunar {
  left: 125rpx;
  animation: switchsolar 500ms;
}

@keyframes switchsolar {
  0% {
    left: 25rpx;
  }

  100% {
    left: 125rpx;
  }
}

.calendar .content .title .switch .solar {
  left: 25rpx;
  animation: switchlunar 500ms;
}

@keyframes switchlunar {
  0% {
    left: 125rpx;
  }

  100% {
    left: 25rpx;
  }
}

.calendar .content .title .ignore-year {
  position: absolute;
  right: 30rpx;
}

.calendar .content picker-div {
  width: 100%;
  height: 500rpx;
  margin: 40rpx auto;
}

.calendar .content picker-div .item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 32rpx;
  font-weight: bold;
}

.calendar .content picker-div .uni-picker-div-wrapper uni-picker-div-column {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 32rpx;
  font-weight: bold;
}

.calendar .content picker-div .uni-picker-div-wrapper uni-picker-div-column .uni-picker-div-group .uni-picker-div-content {
  text-align: center;
  line-height: 110rpx;
}

.calendar .content picker-div .uni-picker-div-wrapper uni-picker-div-column .uni-picker-div-group .uni-picker-div-content .item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 32rpx;
  font-weight: bold;
}

.calendar .content .bottom {
  height: 100rpx;
  width: 100%;
  display: flex;
  background-color: #f7f7f7;
}

.calendar .content .bottom div {
  width: 50%;
  line-height: 110rpx;
  text-align: center;
  font-size: 32rpx;
}

.calendar .content .bottom .left {
  color: #a6a6a6;
  border-right: 1px solid transparent;
}

.calendar .content .bottom .right {
  color: #1860ff;
  border-left: 1px solid #e6e6e6;
}
</style>
