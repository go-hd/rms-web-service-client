const axios = require('axios')

module.exports = class Order {
  /**
   * Order class constructor
   *
   * @param serviceSecret {string}
   * @param licenceKey {string}
   * @param test {boolean}
   */
  constructor (serviceSecret, licenceKey, test = false) {
    const Authorization = 'ESA ' + Buffer.from(`${serviceSecret}:${licenceKey}`).toString('base64')

    this._client = axios.create({
      baseURL: `https://api.rms.rakuten.co.jp/es/2.0/${test ? 'sample.' : ''}order/`,
      headers: {
        Authorization,
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }

  /**
   * この機能を利用すると、楽天ペイ注文の「注文情報の取得」を行うことができます。こちらは同期処理となります。
   *
   * @param orderNumberList {[Number]}
   * @param version {Number}
   * @returns {Promise<{}>}
   */
  getOrder (orderNumberList, version = 4) {
    const body = {orderNumberList, version}
    return this._client.post('getOrder', body).catch(error => error.response)
  }

  /**
   * この機能を利用すると、楽天ペイ注文の「注文検索」を行うことができます。こちらは同期処理となります。
   * 検索結果が 15000 件以上の場合、15001 件目以降の受注番号は取得できません。
   *
   * @param startDatetime {string}
   * @param endDatetime {string}
   * @param dateType {Number}
   * @param options {{}}
   * @returns {Promise<{}>}
   */
  searchOrder (
    startDatetime,
    endDatetime,
    dateType = 1,
    options = {}
  ) {
    const body = {
      startDatetime,
      endDatetime,
      dateType,
      ...options,
    }

    return this._client.post('searchOrder', body).catch(error => error.response)
  }
}