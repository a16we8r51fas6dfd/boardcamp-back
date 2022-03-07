import connection from '../pg.js'

export async function getCustomers (req, res) {

    if (req.query.cpf) {
        try {
            console.log(req.query.cpf)
            const queryCustomer = await connection.query(`
                SELECT * FROM customers 
                WHERE cpf LIKE '${req.query.cpf}%'
            `)
    
            res.send(queryCustomer.rows)
            return
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
            return
        }
    }

    try {
        const customers = await connection.query(`SELECT * FROM customers`)
        res.send(customers.rows)
        return
    } catch (error) {
        res.sendStatus(500)
        return
    }
}

export async function getCustomerById (req, res) {

    const id = req.params.id

    try {
        const customer = await connection.query(`
            SELECT * FROM customers
            WHERE id='${id}'
        `)

        if (customer.rows.length === 0) {
            res.sendStatus(404)
            return
        }

        res.send(customer.rows)
        return
    } catch (error) {
        res.sendStatus(500)
        return
    }
}

export async function postCustomer (req, res) {
    const customer = req.body

    try {
        const cpfAlreadyExists = await connection.query(`
            SELECT * FROM customers
            WHERE cpf='${customer.cpf}'
        `)

        if (cpfAlreadyExists.rows.length > 0) {
            res.sendStatus(409)
            return
        }
        
        await connection.query(`
        INSERT INTO 
            customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
    `, [customer.name, customer.phone, customer.cpf, customer.birthday])
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
        return
    }

    res.sendStatus(201)
}

export async function updateCustomer(req, res) {
    const id = req.params.id
    const customerData = req.body

    try {
        const cpfAlreadyExists = await connection.query(`
            SELECT * FROM customers
            WHERE cpf='${customerData.cpf}'
        `)

        if (cpfAlreadyExists.rows.length > 0) {
            res.sendStatus(409)
            return
        }

        await connection.query(`
            UPDATE customers
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id='${id}'
        `, [customerData.name, customerData.phone, customerData.cpf, customerData.birthday])

        res.sendStatus(200)
        return
    } catch (error) {
        res.sendStatus(500)
        return
    }
}