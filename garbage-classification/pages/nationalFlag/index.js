

const headImg = ['/static/head1.png', '/static/head3.png', '/static/head4.png']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg,
    headIndex: 0,
    avatarUrl: '',
    showCanvas: false,
    systemWidth: 375,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.getSystemInfo({
      success (res) {
        that.setData({
          systemWidth:res.windowWidth,
        })
      }
    })
  },
  getUserInfo(e) {
    const { errMsg, userInfo } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      this.setData({
        avatarUrl: userInfo.avatarUrl
      })
    }
  },
  handleChooseImg() {
    const that = this
    wx.chooseImage({
      success(res) {
        const { tempFilePaths = [] } = res
        that.setData({
          avatarUrl: tempFilePaths[0],
        })
      },
      fail(res) {
        wx.showToast({ title: '图片上传失败，请重新上传哦~', icon: 'none' })
      },
    })
  },
  handleRight() {
    const { headImg, headIndex } = this.data
    const len = headImg.length - 1
    this.setData({
      headIndex: headIndex < len ? headIndex + 1 : 0
    })
  },
  handleLeft() {
    const { headImg, headIndex } = this.data
    const len = headImg.length - 1
    this.setData({
      headIndex: headIndex > 0 ? headIndex - 1 : len
    })
  },

  // 获取图片信息
  getImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success(res) {
          return resolve(res)
        },
        fail(res) {
          return resolve(res)
        },
      })
    })
  },
  async handleSavePhoto() {
    const { systemWidth, headImg, headIndex, avatarUrl } = this.data
    const that = this
    if (!avatarUrl) return false
    that.setData({ showCanvas: true })
    // 生成图片
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.fillRect(0, 0, systemWidth, systemWidth)
    ctx.strokeStyle = '#FFFFFF'
    ctx.save()
    // 绘制头像
    const avatar = await that.getImageInfo(avatarUrl)
    ctx.drawImage(avatar.path, 0, 0, systemWidth, systemWidth)
    ctx.drawImage(`../..${headImg[headIndex]}`, 0, 0, systemWidth, systemWidth)
    ctx.draw(false, (res) => {
      if (res.errMsg === 'drawCanvas:ok') {
        that.canvasToTempFilePath()
      } else {
        that.setData({
          showCanvas: false
        })
      }
    })
  },
  canvasToTempFilePath() {
    const { systemWidth } = this.data
    const that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: systemWidth,
      height: systemWidth,
      destWidth: systemWidth,
      destHeight: systemWidth,
      canvasId: 'myCanvas',
      success(res) {
        that.setData({
          showCanvas: false
        })
        that.handleSaveImg(res.tempFilePath)
      }
    })
  },
  // 保存图片
  handleSaveImg(path) {
    wx.saveImageToPhotosAlbum({
      filePath: path,
      success() {
        wx.showToast({ title: '保存成功' })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '迎国庆换新装',
      path: '/pages/nationalFlag/index'
    } 
  }
})