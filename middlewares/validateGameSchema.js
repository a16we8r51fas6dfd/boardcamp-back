import gameSchema from "../schemas/gameSchema.js";

export default function validateGameSchema(req, res, next) {

    const game = req.body
    
    const validation = gameSchema.validate(game)
    if(validation.error) {
        return res.sendStatus(422)
    }

    next()
}