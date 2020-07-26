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
    promise.then(false, null)
    assert(1 === 1)
  })
  it("2.2.2 如果onFulfilled是函数", done => {
    //此函数必须在 `promise` 完成(fulfilled)后被调用,并把 `promise` 的值作为onFulfilled它的第一个参数；
    //此函数不能被调用超过一次
    let succeed = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(succeed.called)
      resolve(233)
      resolve(2333)
      setTimeout(() => {
        assert(promise.state === "fulfilled")
        assert(succeed.calledWith(233))   //判断参数
        assert.isTrue(succeed.calledOnce)  //判断只调用一次
        done()
      }, 0)
    })
    promise.then(succeed)
  })
  it("2.2.3 如果onRejected是函数", done => {
    let fail = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called)
      reject(403)
      reject(4033)
      setTimeout(() => {
        assert(promise.state === "rejected")
        assert(fail.calledWith(403))
        assert.isTrue(fail.calledOnce)
        done()
      }, 0)
    })
    promise.then(null, fail)
  })
  it("2.2.4 在我的代码执行完毕之前，不得调用 then 后面的俩函数", done => {
    let succeed = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    promise.then(succeed)
    //console.log(1) 在执行完这句代码之后，才去执行succeed
    assert.isFalse(succeed.called)
    setTimeout(() => {
      assert.isTrue(succeed.called)
      done()
    }, 0);
  })
  it("2.2.4 失败回调", done => {
    let fn = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      reject()
    })
    promise.then(null, fn)
    assert.isFalse(fn.called)
    setTimeout(() => {
      assert.isTrue(fn.called)
      done()
    }, 0);
  })
})