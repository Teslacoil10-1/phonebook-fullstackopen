const errHandler = (err, req, res, next) =>{
    console.error(err.message)
    if (err.name === 'CastError'){
        return res.status(400).send({ error: 'malformed id' })
    } else if(err.name === 'ValidationError'){
        return res.status(400).send({ error : error.message})
    }
    next(err)
}

module.exports = errHandler