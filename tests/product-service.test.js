// tests/product-service.test.js
var chai = require('chai')
var expect = chai.expect
var productService = require('../src/services/product-service')
var nock = require('nock')
let URL = process.env['MICROS_PRODUCTS_URL'] || 'mycluster.icp:8899/products';


describe('Product service', function () {

  it('Should call remote service', async function () {
    nock(`https://${URL}`)
      .get('/13')
      .delayBody(10)
      .reply(200, {
        weightLB: 15.5,
        unit: 'lbs'
      })

    let weight = await productService.getProductWeight('13')
    expect(weight).to.equal(15.5)
  })

  it('Should handle unexpected response structure', async function () {
    nock(`https://${URL}`)
      .get('/19')
      .reply(200, {
        res: 15.5
      })

    await productService
      .getProductWeight('19')
      .then(() => {
        throw(new Error('Should not resolve in case of malformed data'))
      })
      .catch(err => {
        expect(err.message).to.equal('Invalid response object')
      })
  })
})