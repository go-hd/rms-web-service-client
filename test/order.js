require('dotenv').config()

const { describe, it } = require('mocha')
const assert = require('assert')

const Order = require('../src/order.js')
const order = new Order(process.env.RMS_SERVICE_SECRET, process.env.RMS_LICENCE_KEY)

describe('searchOrder:受注番号一覧を取得', () => {
  it('取得成功', async () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const date = today.getDate() - 1

    const startDatetime = new Date(year, month, date, 9).toISOString().replace(/\.000Z$/, '+0900')
    const endDatetime = new Date(year, month, date + 1, 8, 59, 59).toISOString().replace(/\.000Z$/, '+0900')

    const PaginationRequestModel = {
      requestRecordsAmount: 10,
      requestPage: 1,
      sortModelList: [
        { sortColumn: 1, sortDirection: 2 }
      ]
    }

    const expectedMessageModelList = [
      {
        messageType: 'INFO',
        messageCode: 'ORDER_EXT_API_SEARCH_ORDER_INFO_101',
        message: '注文検索に成功しました。'
      }
    ]

    const response = await order.searchOrder(startDatetime, endDatetime, 1, { PaginationRequestModel })

    assert.deepStrictEqual(response.data.MessageModelList, expectedMessageModelList)
  })

  it('必要なパラメータを入力しない場合', async () => {
    const response = await order.searchOrder('', '', 1)
    const expectedErrors = [
      {
        messageType: 'ERROR',
        messageCode: 'ORDER_EXT_API_SEARCH_ORDER_ERROR_010',
        message: 'startDatetimeの値を指定して下さい。'
      },
      {
        messageType: 'ERROR',
        messageCode: 'ORDER_EXT_API_SEARCH_ORDER_ERROR_010',
        message: 'endDatetimeの値を指定して下さい。'
      }
    ]

    // noinspection JSUnresolvedVariable
    assert.deepStrictEqual(response.data.MessageModelList, expectedErrors)
  })
})

describe('getOrder:注文情報を取得', () => {
  it('取得成功', async () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const date = today.getDate() - 1

    const startDatetime = new Date(year, month, date, 9).toISOString().replace(/\.000Z$/, '+0900')
    const endDatetime = new Date(year, month, date + 1, 8, 59, 59).toISOString().replace(/\.000Z$/, '+0900')

    const PaginationRequestModel = {
      requestRecordsAmount: 10,
      requestPage: 1,
      sortModelList: [
        { sortColumn: 1, sortDirection: 2 }
      ]
    }

    const orderNumberListResponse = await order.searchOrder(startDatetime, endDatetime, 1, { PaginationRequestModel })
    const { orderNumberList } = orderNumberListResponse.data

    const expectedMessageModelList = itemCount => [
      {
        messageType: 'INFO',
        messageCode: 'ORDER_EXT_API_GET_ORDER_INFO_101',
        message: '受注情報取得に成功しました。(取得件数' + itemCount + '件)'
      }
    ]

    const ordersResponse = await order.getOrder(orderNumberList)

    assert.deepStrictEqual(
      ordersResponse.data.MessageModelList,
      expectedMessageModelList(ordersResponse.data.OrderModelList.length)
    )
  })
})
