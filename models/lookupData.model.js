import dbClient from '../pgHelper/index.js'

export const fetchCountries = async () => {
    const result = await dbClient().query('SELECT id,name,country_code,dial_code FROM countries;')
    return result
}

export const fetchRoles = async () => {
    const result = await dbClient().query('SELECT id,role FROM roles;')
    return result
}

export const fetchStatuses = async () => {
    const result = await dbClient().query('SELECT id,status FROM statuses;')
    return result
}