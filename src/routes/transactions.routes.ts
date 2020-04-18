import { Router } from 'express'

// import TransactionsRepository from '../repositories/TransactionsRepository'
import { CreateTransactionService } from '../services'
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router()

transactionsRouter.get('/', async (request, response) => {
  // TODO
})

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body

  const createTransaction = new CreateTransactionService()

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  })

  response.status(201).json(transaction)
})

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
})

transactionsRouter.post('/import', async (request, response) => {
  // TODO
})

export default transactionsRouter