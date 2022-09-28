export const QUERY_USER_ROLE_BY_EMAIL = `
select User
{
    role,
    active
}
filter .email := <str>$email
;
`