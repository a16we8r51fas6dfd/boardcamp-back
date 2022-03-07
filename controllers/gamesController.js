import connection from "../pg.js";

export async function getGames(req, res) {

    if (req.query.name) {
        try {
            const queryGames = await connection.query(`
                SELECT * FROM games 
                    WHERE name LIKE $1
            `, [`%${req.query.name}`])
    
            res.send(queryGames.rows)
            return
        } catch (error) {
            res.sendStatus(500)
        }
    }

    const games = await connection.query(`SELECT * FROM games`)
    res.send(games.rows)
}

export async function postGame(req, res) {
    const game = req.body

    try {
        const categoryExists = await connection.query(`
            SELECT * FROM categories
            WHERE id='${game.categoryId}'
        `)

        if(categoryExists.rows.length === 0) {
            res.sendStatus(400)
            return
        }

        const gameAlreadyExists = await connection.query(`
            SELECT * FROM games
            WHERE name='${game.name}'
        `)

        if(gameAlreadyExists.rows.length !== 0) {
            res.sendStatus(409)
            return
        }

        await connection.query(`
            INSERT INTO 
                games ("name", "image", "stockTotal", "categoryId", "pricePerDay")
                VALUES ($1, $2, $3, $4, $5)
        `, [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay])
    } catch (error) {
        res.sendStatus(500)
        return
    }

    res.sendStatus(201)
}