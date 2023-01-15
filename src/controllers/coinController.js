const coinModel = require('../models/coinModel')


const coin = async function (req, res) {
    try {
        const response = await fetch('https://api.coincap.io/v2/assets', {
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`
            }
        })
        const { data } = await response.json()
        const sort = data.sort((a, b) => b.changePercent24Hr - a.changePercent24Hr)      //.map((coin)=>{return {symbol:coin.symbol,name:coin.name,marketCapUsd:coin.marketCapUsd,priceUsd:coin.priceUsd}})
        let newData = sort.map(({ symbol, name, marketCapUsd, priceUsd }) => { return { symbol, name, marketCapUsd, priceUsd } })
        let resData = []

        for (let i = 0; i < newData.length; i++) {
            let data = await coinModel.findOneAndUpdate({ symbol: newData[i].symbol }, newData[i], { new: true, upsert: true })
            let { symbol, name, marketCapUsd, priceUsd } = data

            resData.push({ symbol, name, marketCapUsd, priceUsd })
        }
        // newData.forEach(async(coin)=>{
        //     let data = await coinModel.findOneAndUpdate({symbol:coin.symbol},coin,{new:true,upsert:true})
        //     resData.push(data)
        // })
        // let db = await coinModel.find().select("symbol name marketCapUsd priceUsd -_id")

        res.status(200).send({status:true ,data: resData })
        // res.status(200).send({status:true ,data: db })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.massege })
    }
}


module.exports = { coin }