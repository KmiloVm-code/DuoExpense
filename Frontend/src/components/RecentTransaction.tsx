import { convertDate } from '../utils/formatters'

type RecentTransactionProps = {
  title: string
  date: string
  type: 'income' | 'expense' | 'savings'
  amount: string
}

const RecentTransaction: React.FC<RecentTransactionProps> = ({
  title,
  date,
  type,
  amount
}) => (
  <div className="flex items-center justify-between p-4">
    <div className="flex flex-col">
      <h3 className="text-sm font-medium">{title}</h3>
      <small className="text-xs text-gray-500">{convertDate(date)}</small>
    </div>
    <p
      className={`text-sm font-bold ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}
    >
      {amount}
    </p>
  </div>
)

export default RecentTransaction
