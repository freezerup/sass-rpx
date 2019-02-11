# sass-rpx
# 使用指南
### 1：开发前执行yarn run scss ./native/pages 或者  ./native/nativeComponents 会watch相应目录下所有scss文件的变动
### 2: 创建文件时，手动新增同名的.scss文件,修改scss文件时wxss会生成对应的css内容，px:rpx=1:1
### 3: 支持import引用文件
### 4: 注意不要在旧的wxss，添加同名.scss文件，wxss会被清空的
### 5: 无需删除.scss文件，上传时小程序不会对其进行打包的
