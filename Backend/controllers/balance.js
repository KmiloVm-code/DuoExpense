export class BalanceController {
  constructor({ balanceModel }) {
    this.balanceModel = balanceModel
  }

  getAll = async (req, res) => {
    const { id } = req.params
    const filters = req.query
    const balances = await this.balanceModel.getAll({ id, filters })
    if (balances) return res.json(balances)
    res.status(404).send('<h1>Balance not found</h1>')
  }

  getCurrentBalance = async (req, res) => {
    const { id } = req.params
    const filters = req.query
    const balance = await this.balanceModel.getCurrentBalance({ id, filters })
    if (balance) return res.json(balance)
    res.status(404).send('<h1>Balance not found</h1>')
  }

  refreshBalance = async (req, res) => {
    const result = await this.balanceModel.refreshBalance()
    if (result)
      return res.json({ message: 'Monthly balance refreshed successfully' })
    res.status(500).send('<h1>Error refreshing balance</h1>')
  }
}
