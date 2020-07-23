class Promise2 {
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只接受函数作为参数！")
    }
    fn()
  }
  then() {

  }
}

export default Promise2