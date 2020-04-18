import { getRepository, getCustomRepository } from 'typeorm'

import { Transaction, Category } from '../models'
import { TransactionsRepository } from '../repositories'
import { AppError } from '../errors'

interface Request {
  title: string
  value: number
  type: 'income' | 'outcome'
  category: string
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getRepository(Category)

    const { total } = await transactionsRepository.getBalance()

    if (type === 'outcome' && value > total) {
      throw new AppError('You have insufficient balance')
    }

    const category = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    })

    let category_id = category?.id

    if (!category) {
      const newCategory = categoriesRepository.create({ title: categoryTitle })

      await categoriesRepository.save(newCategory)

      category_id = newCategory.id
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    })

    await transactionsRepository.save(newTransaction)

    return newTransaction
  }
}

export default CreateTransactionService
