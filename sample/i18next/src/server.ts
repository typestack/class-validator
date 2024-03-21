import express, { NextFunction, Request, Response } from 'express'
import i18next from 'i18next';
import middleware from 'i18next-http-middleware'
import './utils/i18nextSetup'
import 'reflect-metadata'
import { validateOrReject } from 'class-validator-custom-errors';
import { plainToClass } from 'class-transformer';
import { Url } from './schemas/Url';
const app = express()
app.use([
  middleware.handle(i18next),
  express.json(),
  express.urlencoded({ extended: true }),
]);
app.post('/urls/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateOrReject(plainToClass(Url, req.body), {
      whitelist: true,
      validationError: {
        target: false,
        transformFunction: (key: string) => req.t(`validation.${key}`)
      }
    })
    res.json({ success: true, message: req.t("success"), errors: null })
  } catch (error) {
    res.json({ success: false, message: req.t("failure"), errors: error })
  }
})
export default app