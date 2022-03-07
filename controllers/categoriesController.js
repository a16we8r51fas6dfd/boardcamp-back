import connection from '../pg.js'

export async function getCategories(req, res) {
    try {
        const categories = await connection.query(`SELECT * FROM categories`)
        res.send(categories.rows)
        return
    } catch (error) {
        res.sendStatus(500)
        return
    }
}

export async function postCategories(req, res) {
    try {
        await connection.query(`
            INSERT INTO 
                categories (name)
                VALUES ($1)
        `, [req.body.name])
    } catch (error) {
        res.sendStatus(500)
        return
    }

    if(!req.body.name) {
        res.sendStatus(400)
        return
    }

    res.sendStatus(201)
}