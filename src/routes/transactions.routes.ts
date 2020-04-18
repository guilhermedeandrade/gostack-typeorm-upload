import { Router } from 'express'
import { getCustomRepository } from 'typeorm'

import { CreateTransactionService, DeleteTransactionService } from '../services'
import { TransactionsRepository } from '../repositories'

const transactionsRouter = Router()

transactionsRouter.get('/', async (_request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository)

  const transactions = await transactionsRepository.find()
  const balance = await transactionsRepository.getBalance()

  return response.json({ transactions, balance })
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

  return response.status(201).json(transaction)
})

transactionsRouter.delete('/:id', async (request, response) => {
  console.log('request.params', request.params)
  const { id } = request.params

  const deleteTransaction = new DeleteTransactionService()

  await deleteTransaction.execute(id)

  return response.status(204).send()
})

transactionsRouter.post('/import', async (request, response) => {
  // TODO
})

export default transactionsRouter
