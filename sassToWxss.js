const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const sass = require('sass')
const program = require('commander')

// 生成同名的wxss
function writeFile(fpath) {
  const outFile = fpath.replace(/(.css|.scss)$/, '.wxss')
  sass.render({
    file: path.resolve(fpath),
  }, (error, result) => {
    if(!error){
      fs.writeFile(outFile, result.css, (err) => {
        if(!err){
          pxTorpx(outFile)
        }
      });
    }
  })
}

// px 转 rpx
function pxTorpx(outFile) {
  fs.readFile(outFile, 'utf8', (err, data) => {
    const reg = /(\d+)px/g
    const output = data.replace(reg, (r) => {
      var n = r.replace(/[^0-9]/ig,""); 
      return `${n}rpx`
    })
    fs.writeFileSync(outFile, output);   
  })
}

function log(msg, color) {
  console.log(chalk[color](msg))
}

// watch文件变化
function watch(dpath) {
  const len = dpath.length - 1
  if (dpath[len] === '\\') dpath = dpath.substring(0, len)
  const watch = chokidar.watch([`${dpath}/**/*.css`, `${dpath}/**/*.scss`])
  watch
    .on('add', fpath => {
      writeFile(fpath)
      log(`Add ${fpath} success!`, 'green')
    })
    .on('change', fpath => {
      writeFile(fpath)
      log(`Change ${fpath} success!`, 'blue')
    })
    .on('unlink', fpath => {
      fs.unlinkSync(convertExt(fpath))
      log(`Unlink ${fpath} success!`, 'red')
    })
}

program
  .usage('<path>')

program
  .arguments('<path>')
  .action(dir => {
    fs.stat(dir, (err, stats) => {
      if (err) console.log(chalk.yellow(err))
      else {
        console.log(chalk.bgMagenta.white(' wxss is running... '))
        watch(dir)
      }
    })
  })

program.parse(process.argv)