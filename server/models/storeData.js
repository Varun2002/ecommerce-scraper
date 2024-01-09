const mongoose = require("mongoose")
const scraperDataSchema = new mongoose.Schema({
    title: String,
    pageURL: String,
    productSelector: String,
    infoSelector: String,
    titleSelector: String,
    URLSelector: String,
    priceSelector: String,
    multiplePages: Boolean,
    nextPageSelector: String,
    products: Array
})

const scraperData = mongoose.model("ScraperData", scraperDataSchema)

module.exports = scraperData