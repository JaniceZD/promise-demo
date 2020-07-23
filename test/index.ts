import * as chai from "chai"
import Promise from "../src/promise"

const assert = chai.assert

describe("Promise", () => {
  it("是一个类", () => {
    assert.isFunction(Promise)
    assert.isObject(Promise.prototype)
  })
  it("new Promise()如果接受的不是一个函数就会报错", () => {
    //assert.thow(fn)的作用：如果fn报错，控制台就不报错；如果fn不报错，控制台就报错。
    //即，预测fn会报错
    assert.throw(() => {
      // @ts-ignore
      new Promise()
    })
    assert.throw(() => {
      //@ts-ignore
      new Promise(1)
    })
    assert.throw(() => {
      //@ts-ignore
      new Promise(false)
    })
  })
})