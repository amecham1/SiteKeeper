UPDATE employee
SET first_name = $1,
    last_name = $2,
    admin = $3,
    email = $4,
    password = $5

WHERE user_id = $6;
