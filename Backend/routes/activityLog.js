import { Router } from 'express'
import { ActivityLogController } from '../controllers/activityLog.js'

export const createActivityLogRouter = ({ activityLogModel }) => {
  const activityLogRouter = Router()

  const activityLogController = new ActivityLogController({
    activityLogModel
  })

  activityLogRouter.get('/', activityLogController.getAll)

  return activityLogRouter
}
