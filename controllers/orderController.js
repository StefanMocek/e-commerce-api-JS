const { StatusCodes } = require('http-status-codes');
const Order = require('../models/order.model');
const CustomError = require('../errors');

const createOrder = async (req, res) => {
    res.send('createOrder')
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
