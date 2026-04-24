const {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  PaymentMethod
} = require('../../src/generated/prisma')

const SEED_SETTINGS = {
  totalPerUser: 100, // 7 users x 100 = 700
  batchsize: 200,
  lookbackDays: 180, // last 6 months
  resetBeforeSeed: true // set false if you want append mode
}

const STATUS_WEIGHTS = [
  { value: TransactionStatus.COMPLETED, weight: 70 },
  { value: TransactionStatus.PENDING, weight: 20 },
  { value: TransactionStatus.FAILED, weight: 5 },
  { value: TransactionStatus.CANCELLED, weight: 5 }
]

const TYPE_WEIGHTS = [
  { value: TransactionType.EXPENSE, weight: 60 },
  { value: TransactionType.INCOME, weight: 25 },
  { value: TransactionType.TRANSFER, weight: 10 },
  { value: TransactionType.REFUND, weight: 5 }
]

const CATEGORIES = [
  TransactionCategory.ELECTRONICS,
  TransactionCategory.CLOTHING,
  TransactionCategory.BOOKS,
  TransactionCategory.SPORTS
]

const PAYMENT_METHODS = [
  PaymentMethod.CREDIT_CARD,
  PaymentMethod.DEBIT_CARD,
  PaymentMethod.PAYPAL,
  PaymentMethod.APPLE_PAY,
  PaymentMethod.GOOGLE_PAY
]

const COUNTRIES = ['India', 'USA', 'UK']

const PRODUCT_BY_CATEGORY = {
  ELECTRONICS: [
    'Laptop',
    'Headphones',
    'Smartwatch',
    'Tablet',
    'Bluetooth Speaker'
  ],
  CLOTHING: ['T-shirt', 'Jeans', 'Jacket', 'Sneakers', 'Hoodie'],
  BOOKS: [
    'Clean Code',
    'Atomic Habits',
    'Deep Work',
    'Design Patterns',
    'The Pragmatic Programmer'
  ],
  SPORTS: ['Cricket Bat', 'Football', 'Yoga Mat', 'Running Shoes', 'Dumbbells']
}

const CUSTOMER_NAMES = [
  'John Smith',
  'Emma Johnson',
  'Aarav Sharma',
  'Noah Williams',
  'Sophia Brown',
  'Liam Jones',
  'olivia Garcia',
  'Mia Davis',
  'Ethan Wilson',
  'Isabella Martinez'
]

module.exports = {
  SEED_SETTINGS,
  STATUS_WEIGHTS,
  TYPE_WEIGHTS,
  CATEGORIES,
  PAYMENT_METHODS,
  COUNTRIES,
  PRODUCT_BY_CATEGORY,
  CUSTOMER_NAMES
}
