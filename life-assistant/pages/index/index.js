import allData from '../../utils/data'

const { garbageData, classificationData } = allData
let timer = null
Page({
  data: {
    lists: [],
    classificationData,
    inputKey: '',
    historyKeywords: [],
    showContent: false,
    currentData: {},
    front: true,
  },
  
  onLoad: function () {
    this.setAnimation()
  },
  setAnimation() {
    timer = setInterval(() => {
      this.setData({
        front: !this.data.front
      })
    }, 2000)
  },
  onHide() {
    timer = null
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
  handleShowContent(event) {
    const { id } = event.currentTarget.dataset
    const currentData = classificationData.filter(item => item.id === id)[0]
    console.log(currentData)
    currentData.requires = currentData.require.split('；')
    this.setData({
      showContent: true,
      currentData,
    })
  },
  handleHideContent() {
    this.setData({
      showContent: false,
      currentData: {},
    })
  },
})
