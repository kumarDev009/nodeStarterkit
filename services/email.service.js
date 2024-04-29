/* eslint-disable no-unused-vars */
import nodeMailer from 'nodemailer';
import { successHandler } from '../middlewares/successHandler.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { errorLogger, infoLogger } from '../middlewares/logger.js';
import { ENDPOINTS, ERROR_MESSAGE, STATUS, SUCCESS_MESSAGE, RESPONSE_CODE } from '../utils/constants.js';
import { loggerLogFormat } from '../utils/HelperFunction.js';

const handleSendMail = async (emailData, res, req) => {
	const html = `
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Card Design</title>
        <style>
            table {
                width: 35rem;
                border-collapse: collapse;
                margin: 20px auto;
                background-color: #f0f0f0;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            th, td {
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #333;
                color: white;
            }
            td {
                border-top: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <table>
            <tr>
                <td colspan="2" style="height: 5rem; padding:1.5rem; text-align:center;">
                <img height="170px" width="100%" src="https://res.cloudinary.com/dfkgcnzjn/image/upload/v1694006165/MITRAHSOFT_lqye7u.jpg"/>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="font-size: 20px; padding:1.5rem">
                <p>${emailData.bodyContent_1}</p>
                <p>${emailData.bodyContent_2}</p>
                </td>
            </tr>
        </table>
    </body>
  </html>`;

  try {
    const transport = nodeMailer.createTransport({
      service: process.env.EMAIL_SERVICE_PROVIDER,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
      },
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
    })
    const info = await transport.sendMail({
      from: `MitrahSoft <${process.env.Email}>`,
      to: emailData.toEmailAddress,
      subject: emailData.subject,
      html: html
    })
    let responseMsg = { message: emailData.response_msg, code: RESPONSE_CODE.VERIFY_OTP_CODE };
    infoLogger.info(
      loggerLogFormat(ENDPOINTS.GENERATE_OTP, req.body, responseMsg)
    );
    successHandler(STATUS.CREATED.CODE, res, responseMsg);
  } catch (error) {
    errorLogger.error(loggerLogFormat(ENDPOINTS.GENERATE_OTP, req.body, error));
    errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { message: ERROR_MESSAGE.WENT_WRONG });
  }
}

export default handleSendMail;
