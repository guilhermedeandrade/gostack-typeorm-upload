import { getCustomRepository } from 'typeorm'

import { TransactionsRepository } from '../repositories'
import { AppError } from '../errors'

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const transaction = await transactionsRepository.findOne({ where: { id } })

    if (!transaction) {
      throw new AppError('There is not a transaction with the given id')
    }

    await transactionsRepository.delete(id)
  }
}

export default DeleteTransactionService
