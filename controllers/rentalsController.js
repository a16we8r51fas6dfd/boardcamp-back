import connection from "../db.js";
import dayjs from 'dayjs'

export async function postRental(req, res) {

    const rentalData = req.body

    if (rentalData.daysRented < 1) {
        res.sendStatus(400)
        return
    }
    
    try {
        const customerExists = await connection.query(`
            SELECT * FROM customers
            WHERE id='${rentalData.customerId}'
        `)

        const gameExists = await connection.query(`
            SELECT * FROM games
            WHERE id='${rentalData.gameId}'
        `)

        const avaliableGames = await connection.query(`
            SELECT * FROM rentals
            WHERE "gameId" = $1
            AND "returnDate" IS null
        `, [rentalData.gameId])


        if(gameExists.rows === 0 || customerExists.rows === 0 || (gameExists.rows.stockTotal - avaliableGames.length === 0)) {
            res.sendStatus(400)
            return
        }

        const gameData = await connection.query(`
            SELECT * FROM games
            WHERE id='${rentalData.gameId}'
        `)

        const originalPrice = gameData.rows[0].pricePerDay * rentalData.daysRented

        const rentDate = dayjs().format("YYYY-MM-DD")
        
        await connection.query(`
            INSERT INTO
                rentals ("customerId", "gameId", "rentDate" ,"daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [rentalData.customerId, rentalData.gameId, rentDate , rentalData.daysRented, null, originalPrice, null])

        res.sendStatus(200)
        return
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
        return
    }
}

export async function getRentals(req, res) {

    const { customerId, gameId } = req.query

    try {
        const rentals = await connection.query(`
            SELECT 
                rentals.*,
                customers.name AS "customerName",
                games.name AS "gameName",
                games."categoryId",
                categories.name AS "categoryName"
            FROM rentals
            JOIN customers ON customers.id=rentals."customerId"
            JOIN games ON games.id=rentals."gameId"
            JOIN categories ON categories.id=games."categoryId"
        `)

        const rentalsArray = rentals.rows.map( rental => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customerId,
                name: rental.customerName,
            },
            game:{
                id: rental.gameId,
                name: rental.gameName,
                categoryId: rental.categoryId,
                categoryName: rental.categoryName
            }
        }))

        if(customerId) {
            const rentalByCustomer = rentalsArray.filter(rentals => {
                return rentals.customerId === parseInt(customerId)
            })

            res.send(rentalByCustomer)
            return
        }

        if(gameId) {
            const rentalByGame = rentalsArray.filter(rentals => {
                return rentals.gameId === parseInt(gameId)
            })

            res.send(rentalByGame)
            return
        }

        res.send(rentalsArray)
        return
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export async function returnRental(req, res) {
    const { id } = req.params

    const returnDate = dayjs().format("YYYY-MM-DD")

    try {

        const rentalData = await connection.query(`
            SELECT * FROM rentals WHERE id=$1
        `, [id])

        const rentDate = dayjs(rentalData.rows[0].rentDate)
        const pricePerDay = parseInt(rentalData.rows[0].originalPrice)/parseInt(rentalData.rows[0].daysRented)

        const delayedDays = dayjs().diff(rentDate, "days") - rentalData.rows[0].daysRented
        const delayFee = pricePerDay * delayedDays

        console.log(delayFee)
        console.log(returnDate)

        await connection.query(`
            UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id=$3
        `, [returnDate, delayFee, id])

        res.sendStatus(200)
        return
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
        return
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params

    try {
        const rentalData = await connection.query(`
            SELECT * FROM rentals WHERE id=$1
        `, [id])

        if (rentalData.rows.length === 0) {
            res.sendStatus(404)
            return
        }

        if (rentalData.rows[0].returnDate !== null) {
            res.sendStatus(400)
            return
        }

        await connection.query(`
            DELETE FROM rentals WHERE id=$1
        `, [id])

        res.sendStatus(200)
        return
    } catch (error) {
        res.sendStatus(500)
        return
    }
}