export class ActivityLogController {
  constructor({ activityLogModel }) {
    this.activityLogModel = activityLogModel
  }

  getAll = async (req, res) => {
    const filters = req.query

    const result = await this.activityLogModel.getAll({ filters })

    if (!result) {
      return res.status(404).json({
        error: 'No activity logs found'
      })
    }

    res.status(200).json(result)
  }
}
