const { StatusCodes } = require('http-status-codes');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils')

const fakeStripeApi = async ({ amount, currency }) => {
    const clientSecret = 'someRandomValue';
    return { clientSecret, amount }
};

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided')
    };

    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee')
    };

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new CustomError.NotFoundError(`No product with id: ${item.product}`);
        };
        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        };
        orderItems = [...orderItems, singleOrderItem];
        subtotal += item.amount * price;
    };

    const total = tax + shippingFee + subtotal;

    const paymentIntent = await fakeStripeApi({
        amount: total,
        currency: 'pln'
    });

    const order = await Order.create({
        orderItems, 
        total, 
        subtotal, 
        tax, 
        shippingFee, 
        clientSecret: paymentIntent.clientSecret, 
        user: req.user.userId
    });

    res.status(StatusCodes.CREATED).json({order, clinetSecret: order.clientSecret})
};

const getAllOrders = async (req, res) => {
    res.send('getAllOrders')
};

const getSingleOrder = async (req, res) => {
    res.send('getSingleOrder')
};

const getCurrentUserOrders = async (req, res) => {
    res.send('getCurrentUserOrders')
};

const updateOrder = async (req, res) => {
    res.send('updateOrder')
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
};
