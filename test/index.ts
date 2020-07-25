import * as chai from "chai"
import * as sinon from "sinon"
import * as sinonChai from "sinon-chai"
import Promise from "../src/promise"

chai.use(sinonChai)

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
  it("new Promise(fn)会生成一个对象，对象有 then 方法", () => {
    const promise = new Promise(() => { })
    assert.isObject(promise)
    assert.isFunction(promise.then)
  })
  it("new Promise(fn)中的 fn 会立即执行", () => {
    let fn = sinon.fake()
    new Promise(fn)
    assert(fn.called)
  })
  it("new Promise(fn)中的 fn 执行的时候必须接受 resolve 和 reject 两个函数", done => {
    new Promise((resolve, reject) => {
      assert.isFunction(resolve)
      assert.isFunction(reject)
      done()
    })
  })
  it("promise.then(success)中的 success 会在 resolve 被调用的时候执行", done => {
    let success = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(success.called)
      resolve()
      //先等resolve里的success执行
      setTimeout(() => {
        assert.isTrue(success.called)
        done()
      }, 0)
    })
    promise.then(success)
  })
  it("promise.then(null,fail)中的 fail 会在 reject 被调用的时候执行", done => {
    let fail = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called)
      reject()
      setTimeout(() => {
        assert.isTrue(fail.called)
        done()
      }, 0)
    })
    promise.then(null, fail)
  })
  //参考文档写测试用例
  it("2.2.1 onFulfilled和onRejected都是可选的参数", () => {
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    promise.then(false)
    assert(1 === 1)
  })
})