class Promise2 {
  succeed = null
  fail = null
  state = "pending"

  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只接受函数作为参数！")
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fulfilled"
    nextTick(() => {
      if (typeof this.succeed === "function") {
        this.succeed(result)
      }
    })
  }
  reject(reason) {
    if (this.state !== "pending") return;
    this.state = "rejected"
    nextTick(() => {
      if (typeof this.fail === "function") {
        this.fail(reason)
      }
    })
  }
  then(succeed?, fail?) {
    if (typeof succeed === "function") {
      this.succeed = succeed
    }
    if (typeof fail === "function") {
      this.fail = fail
    }
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

