import dbClient from '../pgHelper/index.js'

const fetchUserById = async (id) => await dbClient().query(`SELECT * FROM users WHERE id = '${id}'`)

const fetchUserByEmail = async (email) => await dbClient().query(`SELECT * FROM users WHERE email = '${email}'`)

const fetchAllUsers = async ({ pageSize, offset, search_terms }) => {

  let condition = `WHERE 1 = 1`;
  if (search_terms) {
    condition = `
    WHERE u.email like '%${search_terms}%' OR u.full_name like '%${search_terms}%' OR u.city like '%${search_terms}%' OR u.state like '%${search_terms}%' OR u.country like '%${search_terms}% OR u.zip_code like '%${search_terms}%'
    `
  }

  const query = {
    text: `
        SELECT 
          u.id,
          u.email, u.first_name, u.last_name, u.full_name, u.phone, u.address1, u.address2, u.city, u.state, u.country, u.zip_code, s.status, s.id as status_id, r.role, r.id as role_id, u.dob
        FROM users u
        inner join roles r on r."role" = u."role" 
        inner join statuses s on s.status = u.status 
        ${condition}
        ORDER BY u.created_date
        LIMIT $1
        OFFSET $2
      `,
    values: [pageSize, offset],
  }
  return await dbClient().query(query)
}

const updateUserDetails = async (data, id) => {
	const {
		first_name,
		last_name,
		address1 = '',
		address2 = '',
		phone = '',
		zip_code = '',
		city = '',
		state = '',
		updated_by = ''
	} = data;
	const response = await dbClient()
		.query(`UPDATE users SET first_name = '${first_name}', last_name = '${last_name}', 
    full_name = '${
			first_name + ' ' + last_name
		}', phone = '${phone}', address1 = '${address1}', address2 = '${address2}', 
    city = '${city}', state = '${state}', zip_code = '${zip_code}', updated_by = '${updated_by}' 
    WHERE id = '${id}'`);
	return response;
};
// const updateUserDetails = async (data) => {
//   const { firstName, lastName, fullName, zipCode, ...rest } = data;

//   firstName ? rest.first_name = firstName : null;
//   lastName ? rest.last_name = lastName : null;
//   fullName ? rest.full_name = fullName : null;
//   zipCode ? rest.zip_code = zipCode : null;

//   const condition = Object.keys(rest).map((field, index) => {
//     return `${field} = $${index + 1}`;
//   });

//   const query = {
//     text: `
//     UPDATE users
//     SET
//     ${condition.join(', ')}
//     WHERE id = $${Object.keys(rest).length + 1}
//     `,
//     values: [...Object.values(rest), rest.id],
//   };

//   return await dbClient().query(query)
// }

const resetPwd = async (email, newPwd) => {
  const response = await dbClient().query(
    `UPDATE users SET password_hash = $1 WHERE email = $2`, [newPwd, email]
  );
  return response;
}

const insertData = async data => {
  const response = await dbClient().query(
    'INSERT INTO users (id,email,password_hash,first_name,last_name,full_name,dob,status) VALUES(gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7)',
    [
      data.email,
      data.password_hash,
      data.first_name,
      data.last_name,
      data.full_name,
      data.dob,
      data.status
    ]
  );

  return response
}

const deleteUserDetails = async (id) => await dbClient().query(`DELETE FROM users WHERE id = '${id}'`)

export { fetchUserById, fetchUserByEmail, fetchAllUsers, deleteUserDetails, resetPwd, updateUserDetails, insertData };
