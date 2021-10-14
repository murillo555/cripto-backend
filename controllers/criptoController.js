const { response, request } = require('express');
const dayjs = require('dayjs')
const { Investment, TimeLine, Currency } = require('../models');
const { logger } = require('../libs/logger');
const axios = require('axios');
const { dataBase, entityNoExists, entityDelete, entityCreate, entityUpdate, paramsError } = require('config').get('message');

const BITCOIN_URL = 'https://data.messari.io/api/v1/assets/bitcoin/metrics';
const ETHEREUM_URL = 'https://data.messari.io/api/v1/assets/ethereum/metrics';
const CARDANO_URL = 'https://data.messari.io/api/v1/assets/cardano/metrics';


/**
 * This method is for obtain de General Data of criptoCurrency   
 * @return {json} json String
 * @author Gabriel Murillo
 */
const criptoAssets = async(req = request, res = response) => {
    logger.verbose('[cripto, criptoGet]', 'Get general data for cripto Currency');
    logger.debug(`${ process.env.MESSARI_API_KEY}`);
    const params = {
        headers: {
            'Content-Type': 'application/json',
            "x-messari-api-key": `${ process.env.MESSARI_API_KEY}`
        }
    }
    try {
        const bitCoinRaw = await axios.get(BITCOIN_URL, params.headers);
        const ethereumRaw = await axios.get(ETHEREUM_URL, params.headers);
        const cardanoRaw = await axios.get(CARDANO_URL, params.headers);
        logger.silly(bitCoinRaw.data)
        const bitCoinData = {
            slug: bitCoinRaw.data.data.slug,
            symbol: bitCoinRaw.data.data.symbol,
            price: bitCoinRaw.data.data.market_data.price_usd.toFixed(2),
            change_1h: bitCoinRaw.data.data.market_data.percent_change_usd_last_1_hour.toFixed(2),
            change_24h: bitCoinRaw.data.data.market_data.percent_change_usd_last_24_hours.toFixed(2),
            change_7d: bitCoinRaw.data.data.roi_data.percent_change_last_1_week.toFixed(2),
            change_30d: bitCoinRaw.data.data.roi_data.percent_change_last_1_month.toFixed(2),
            change_ytd: bitCoinRaw.data.data.roi_data.percent_change_year_to_date.toFixed(2),
            marketCap: (Math.abs(Number(bitCoinRaw.data.data.on_chain_data.realized_marketcap_usd)) / 1.0e+9).toFixed(2),
            realVolume: (Math.abs(Number(bitCoinRaw.data.data.market_data.real_volume_last_24_hours)) / 1.0e+9).toFixed(2)
        }
        const ethereumData = {
            slug: ethereumRaw.data.data.slug,
            symbol: ethereumRaw.data.data.symbol,
            price: ethereumRaw.data.data.market_data.price_usd.toFixed(2),
            change_1h: ethereumRaw.data.data.market_data.percent_change_usd_last_1_hour.toFixed(2),
            change_24h: ethereumRaw.data.data.market_data.percent_change_usd_last_24_hours.toFixed(2),
            change_7d: ethereumRaw.data.data.roi_data.percent_change_last_1_week.toFixed(2),
            change_30d: ethereumRaw.data.data.roi_data.percent_change_last_1_month.toFixed(2),
            change_ytd: ethereumRaw.data.data.roi_data.percent_change_year_to_date.toFixed(2),
            marketCap: (Math.abs(Number(ethereumRaw.data.data.on_chain_data.realized_marketcap_usd)) / 1.0e+9).toFixed(2),
            realVolume: (Math.abs(Number(ethereumRaw.data.data.market_data.real_volume_last_24_hours)) / 1.0e+9).toFixed(2)
        }
        const cardanoData = {
            slug: cardanoRaw.data.data.slug,
            symbol: cardanoRaw.data.data.symbol,
            price: cardanoRaw.data.data.market_data.price_usd.toFixed(2),
            change_1h: cardanoRaw.data.data.market_data.percent_change_usd_last_1_hour.toFixed(2),
            change_24h: cardanoRaw.data.data.market_data.percent_change_usd_last_24_hours.toFixed(2),
            change_7d: cardanoRaw.data.data.roi_data.percent_change_last_1_week.toFixed(2),
            change_30d: cardanoRaw.data.data.roi_data.percent_change_last_1_month.toFixed(2),
            change_ytd: cardanoRaw.data.data.roi_data.percent_change_year_to_date.toFixed(2),
            marketCap: (Math.abs(Number(cardanoRaw.data.data.on_chain_data.realized_marketcap_usd)) / 1.0e+9).toFixed(2),
            realVolume: (Math.abs(Number(cardanoRaw.data.data.market_data.real_volume_last_24_hours)) / 1.0e+9).toFixed(2)
        }
        const data = [bitCoinData, ethereumData, cardanoData]

        logger.silly(data)
        res.json(data)
    } catch (error) {
        logger.error('[cripto, criptoGet]', error);
        res.status(500).json(dataBase);
    }
}
const addCriptoCurrency = async(req = request, res = response) => {
    logger.verbose('[cripto, addCriptoCurrency]', 'Get general data for cripto Currency');
    const { name, slug, symbol, investmentValue } = req.body;
    try {
        const currency = await new Currency({ name, slug, symbol, investmentValue })
        await currency.save();
        logger.debug(currency)
        res.json(entityCreate);
    } catch (error) {
        logger.error('[cripto, addCriptoCurrency]', error);
        res.status(500).json(dataBase);
    }
}

const getCriptoCurrency = async(req = request, res = response) => {
    logger.verbose('[cripto, addCriptoCurrency]', 'Get general data for cripto Currency');
    try {
        const currencies = await Currency.find()
        logger.debug(currencies)
        res.json(currencies);
    } catch (error) {
        logger.error('[cripto, addCriptoCurrency]', error);
        res.status(500).json(dataBase);
    }
}


const addInvestment = async(req = request, res = response) => {
    logger.verbose('[cripto, addInvestment]', 'Get general data for cripto Currency');
    const { currency, investment } = req.body;
    const user = req.user._id;
    try {
        const { investmentValue } = await Currency.findById(currency);

        const percentage = (1 + investmentValue / 100)
        const monthly = Math.pow(percentage, 1) * investment;
        const semiAnnual = Math.pow(percentage, 6) * investment;
        const anual = Math.pow(percentage, 12) * investment;

        const newInvestment = await new Investment({ currency, monthly, semiAnnual, anual, user, investment });
        await newInvestment.save();
        logger.debug(percentage);
        res.json(entityCreate);
    } catch (error) {
        logger.error('[cripto, addInvestment]', error);
        res.status(500).json(dataBase);
    }
}

const getInvestment = async(req = request, res = response) => {
    logger.verbose('[cripto, getInvestment]', 'Get general data for cripto Currency');
    try {
        const investments = await Investment.find({ user: req.user._id }).populate('currency', '-__v')
        res.json(investments);
    } catch (error) {
        logger.error('[cripto, getInvestment]', error);
        res.status(500).json(dataBase);
    }
}

module.exports = {
    criptoAssets,
    addCriptoCurrency,
    getCriptoCurrency,
    addInvestment,
    getInvestment
}