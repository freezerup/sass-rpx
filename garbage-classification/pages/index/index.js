import allData from '../../utils/data'

const { garbageData, classificationData } = allData
Page({
  data: {
    lists: [],
    classificationData,
    inputKey: '',
    historyKeywords: [],
  },
  
  onLoad: function () {

  },
  bindInput(event) {
    const { value } = event.detail
    if (!value) return
    let lists = garbageData.filter(item => item.name.indexOf(`${value}`) > -1)
    if (!lists.length) {
      lists = value.split('').reduce((total, v) => {
        return total.concat(garbageData.filter(item => item.name.indexOf(`${v}`) > -1))
      }, [])
    }
    this.setData({
      lists,
      inputKey: value,
    })
  },
  handleClear() {
    this.setData({
      inputKey: '',
      lists: [],
    })
  },
})
