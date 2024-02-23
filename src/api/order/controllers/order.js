

// @ts-ignore

const stripe = require('stripe')('sk_test_51NPwQjLPeqREPOpw6vb9V3nHd9ICPsmQxIFzX67Yot5YT7ykPV7ljWq5W5sWykPLSaBBVtgrQhtn837954Rhxmsh00ZzfqUgpq', { apiVersion: "2022-11-15", host: "api.stripe.com" })

function calcDiscountPrice(price, discount){
  if(!discount) return price

  const discountAmount = (price * discount) / 100
  const result = price - discountAmount

  return result.toFixed(2)
}

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories

module.exports = createCoreController("api::order.order", ({strapi}) => ({
  async paymentOrder(ctx){
    // @ts-ignore
    const {token, products, userId} = ctx.request.body

    let totalPayment = 0

    products.forEach((product) => {
      const priceTemp = calcDiscountPrice(product.price, product.discount)

      totalPayment += Number(priceTemp) * product.quantity
    })

    const charge = await stripe.charges.create({
      amount: Math.round(totalPayment * 100),
      currency: "MXN",
      source: token,
      description: `User ID: ${userId}`
    })

    const data = {
      products,
      user: userId,
      totalPayment,
      idPayment: charge.id
    }

    const model = strapi.contentTypes["api::order.order"];
    const validData = await strapi.entityValidator.validateEntityCreation(
      model,
      data
    )

    const entry = await strapi.db
      .query("api::order.order")
      .create({ data: validData })

    return entry
    
  }
}))
