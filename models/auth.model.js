import dbClient from '../pgHelper/index.js';

export const statusUpdate = async (email)=>{
    const response = await dbClient().query("UPDATE users SET status = $1, verification_code = $2, verification_code_expiry = $3 WHERE email = $4;", ['Active',null,null,email])
    return response
}
