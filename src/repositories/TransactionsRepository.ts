import { EntityRepository, Repository } from 'typeorm'

import { Transaction } from '../models'

interface Balance {
  income: number
  outcome: number
  total: number
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find()

    const initialBalance = { income: 0, outcome: 0, total: 0 }

    const balance = transactions.reduce(
      (acc: Balance, transaction: Transaction) => {
        const value = Number(transaction.value)

        switch (transaction.type) {
          case 'income':
            return {
              ...acc,
              income: acc.income + value,
              total: acc.income + value - acc.outcome,
            }
          case 'outcome':
            return {
              ...acc,
              outcome: acc.outcome + value,
              total: acc.income - (acc.outcome + value),
            }
          default:
            return acc
        }
      },
      initialBalance,
    )

    return balance
  }
}

export default TransactionsRepository
