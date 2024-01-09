const storeDataModel = require('../models/storeData')
const StoreScraper = require('../scrapers/storeScraper')

const scraper = new StoreScraper()

const fetchStoreDataSets = async (req, res) => {
    const stores = await storeDataModel.find();
    res.json({ stores });
  };

  const fetchStoreData = async (req, res) => {
    const storeID = req.params.id;
  
    const storeData = await storeDataModel.findById(storeID);
  
    res.json({ storeData });
  };

  const createStoreData = async (req, res) => {
    const { 
      title,
      pageURL,
      productSelector,
      infoSelector,
      titleSelector,
      URLSelector,
      priceSelector,
      multiplePages,
      nextPageSelector,
      products

     } = req.body;
  
    const storeData = await storeDataModel.create({
        title,
        pageURL,
        productSelector,
        infoSelector,
        titleSelector,
        URLSelector,
        priceSelector,
        multiplePages,
        nextPageSelector,
        products

    });
  
    res.json({ storeData });
  };  

  const updateStoreData = async (req, res) => {
    const storeID = req.params.id;
      const {  
        title,
        pageURL,
        productSelector,
        infoSelector,
        titleSelector,
        URLSelector,
        priceSelector,
        multiplePages,
        nextPageSelector,
        products

    } = req.body;
  
    await storeDataModel.findByIdAndUpdate(storeID, {
        title,
        pageURL,
        productSelector,
        infoSelector,
        titleSelector,
        URLSelector,
        priceSelector,
        multiplePages,
        nextPageSelector,
        products 
    });
  
    const storeData = await storeDataModel.findById(storeID);
  
    res.json({ storeData });
  };

  const deleteStoreData = async (req, res) => {
    const storeID = req.params.id;
    const storeData = await storeDataModel.findById(storeID);

    try {
      const result = await storeDataModel.deleteOne({ _id: storeID });
      if(result.deletedCount >0){
        res.json(storeData)
      }else{
        res.json("store not found")
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const scanStore = async(req, res) =>{

    const store = req.body.store.data.storeData
    const count = req.body.count
    products = await scraper.startScan(store, count)
    res.json(products)

  }

  const endScan = (req, res) =>{
    res.json(scraper.endScan())

  }


  module.exports = {
    fetchStoreDataSets,
    fetchStoreData,
    createStoreData,
    updateStoreData,
    deleteStoreData,
    scanStore,
    endScan,
  };
  