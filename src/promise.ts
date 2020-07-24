class Promise2 {
  succeed = null
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只接受函数作为参数！")
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve() {
    nextTick(() => {
      this.succeed()
    })
  }
  reject() {

  }
  then(succeed) {
    this.succeed = succeed
  }
}

export default Promise2

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn)
  } else {
    var counter = 1
    var observer = new MutationObserver(fn)
    var textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    });

    counter = counter + 1
    textNode.data = String(counter)
  }
}

