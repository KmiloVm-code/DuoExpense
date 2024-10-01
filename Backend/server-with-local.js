import { createApp } from './app.js'

import { UserModel } from './models/local-file-system/user.js'

createApp({ userModel: UserModel })
