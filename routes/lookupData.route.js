import express from 'express';

import getLookupDataController from '../controllers/lookupData.controller.js'
import { ENDPOINTS } from '../utils/constants.js';


/**
 * @swagger
 * components :
 *      schemas :
 *          GetCountries :
 *              type : object
 *              properties :
 *                  name :
 *                      type : string
 *                      example : India
 *                  country_code :
 *                      type : string
 *                      example : IN
 *                  dial_code :
 *                      type : string
 *                      example : +91
 *          GetCountriesDataSuccess :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Countries details are retrieved successfully
 *          GetCountriesDataFailure :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Not Found
 *          GetRoles :
 *              type : object
 *              properties :
 *                  role :
 *                      type : string
 *                      example : Admin / User
 *          GetRolesDataSuccess :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Roles details are retrieved successfully
 *          GetRolesDataFailure :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Not Found
 *          GetStatuses :
 *              type : object
 *              properties :
 *                  status :
 *                      type : string
 *                      example : Active / Inactive / Pending / deleted
 *          GetStatusSuccess :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Statuses are retrieved successfully
 *          GetStatusFailure :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Not Found
 * /get_countries :
 *      get :
 *          tags : [LookupData]
 *          summary : Get List of Countries
 *          security :
 *                 - bearerAuth : []
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/GetCountriesDataSuccess'
 *               404 :
 *                  description : Not Found
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/GetCountriesDataFailure'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 * /get_roles :
 *      get :
 *          tags : [LookupData]
 *          summary : Get List of Roles
 *          security :
 *                 - bearerAuth : []
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/GetRolesDataSuccess'
 *               404 :
 *                  description : Not Found
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/GetRolesDataFailure'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 * /get_statuses :
 *      get :
 *          tags : [LookupData]
 *          summary : Retrieve a list of statuses
 *          security :
 *                 - bearerAuth : []
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/GetStatusSuccess'
 *               404 :
 *                  description : Not Found
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/GetStatusFailure'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 */

const router = express.Router();

router.get(ENDPOINTS.GET_COUNTRIES, getLookupDataController.getCountries)
router.get(ENDPOINTS.GET_ROLES, getLookupDataController.getRoles)
router.get(ENDPOINTS.GET_STATUS, getLookupDataController.getStatus)

export default router