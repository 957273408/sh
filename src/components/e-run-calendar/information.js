const data = {
  // 性别
  sexData: [
    {
      value: 'male',
      label: '男',
    },
    {
      value: 'female',
      label: '女',
    },
  ],
  // 血型
  bloodData: [
    {
      value: 'A',
      label: 'A型',
    },
    {
      value: 'B',
      label: 'B型',
    },
    {
      value: 'AB',
      label: 'AB型',
    },
    {
      value: 'O',
      label: 'O型',
    },
  ],
  // 农历新历时辰
  lunarHour: [
    {
      value: '24',
      solar: '未知',
      text: '未知',
    },
    {
      value: '0',
      solar: '0点',
      text: '0时子时',
    },
    {
      value: '1',
      solar: '1点',
      text: '1时丑时',
    },
    {
      value: '2',
      solar: '2点',
      text: '2时丑时',
    },
    {
      value: '3',
      solar: '3点',
      text: '3时寅时',
    },
    {
      value: '4',
      solar: '4点',
      text: '4时寅时',
    },
    {
      value: '5',
      solar: '5点',
      text: '5时卯时',
    },
    {
      value: '6',
      solar: '6点',
      text: '6时卯时',
    },
    {
      value: '7',
      solar: '7点',
      text: '7时辰时',
    },
    {
      value: '8',
      solar: '8点',
      text: '8时辰时',
    },
    {
      value: '9',
      solar: '9点',
      text: '9时巳时',
    },
    {
      value: '10',
      solar: '10点',
      text: '10时巳时',
    },
    {
      value: '11',
      solar: '11点',
      text: '11时午时',
    },
    {
      value: '12',
      solar: '12点',
      text: '12时午时',
    },
    {
      value: '13',
      solar: '13点',
      text: '13时未时',
    },
    {
      value: '14',
      solar: '14点',
      text: '14时未时',
    },
    {
      value: '15',
      solar: '15点',
      text: '15时申时',
    },
    {
      value: '16',
      solar: '16点',
      text: '16时申时',
    },
    {
      value: '17',
      solar: '17点',
      text: '17时酉时',
    },
    {
      value: '18',
      solar: '18点',
      text: '18时酉时',
    },
    {
      value: '19',
      solar: '19点',
      text: '19时戌时',
    },
    {
      value: '20',
      solar: '20点',
      text: '20时戌时',
    },
    {
      value: '21',
      solar: '21点',
      text: '21时亥时',
    },
    {
      value: '22',
      solar: '22点',
      text: '22时亥时',
    },
    {
      value: '23',
      solar: '23点',
      text: '23时子时',
    },
  ],
  getlunarHour(val){
    return this.lunarHour.map(item=>{
      item.value = val + this.index + item.text
      return item
    })
  }
}

export default data
