import fs from 'fs'
import neatCsv from 'neat-csv'

import CreateTransactionService from './CreateTransactionService'

import { Transaction } from '../models'

interface CreateTransactionDTO {
  title: string
  value: number
  type: 'income' | 'outcome'
  category: string
}

class ImportTransactionsService {
  async execute(importFile: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService()

    const rawData = await fs.promises.readFile(importFile)

    const data = await neatCsv<CreateTransactionDTO>(rawData, {
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ value }) => value.trim(),
    })

    const newTransactions: Transaction[] = []

    for (const row of data) {
      const transaction = await createTransaction.execute(row)

      newTransactions.push(transaction)
    }

    await fs.promises.unlink(importFile)

    return newTransactions
  }
}

export default ImportTransactionsService
