import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import multer from 'multer'
import path from 'path'

import {
  CreateTransactionService,
  DeleteTransactionService,
  ImportTransactionsService,
} from '../services'
import { TransactionsRepository } from '../repositories'
import { uploadConfig } from '../config'

const transactionsRouter = Router()
const upload = multer(uploadConfig)

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
  const { id } = request.params

  const deleteTransaction = new DeleteTransactionService()

  await deleteTransaction.execute(id)

  return response.status(204).send()
})

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importFile = path.join(uploadConfig.directory, request.file.filename)

    const importTransaction = new ImportTransactionsService()

    const transactions = await importTransaction.execute(importFile)

    return response.status(201).json(transactions)
  },
)

export default transactionsRouter
