import categorySchema from '../schemas/categorySchema.js'
import connection from '../db.js'

export async function validateCategorySchema(req, res, next) {
    const category = req.body

    const categoryAlredyExists = await connection.query(`
        SELECT * FROM categories
        WHERE name='${category.name}'
    `)

    if(!category.name) {
        return res.sendStatus(400)
    }

    if(categoryAlredyExists.rows.length !== 0) {
        return res.sendStatus(409)
    }

    const validation = categorySchema.validate(category)
    if(validation.error) {
        return res.sendStatus(422)
    }

    next()
}