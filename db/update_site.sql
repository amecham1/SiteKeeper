UPDATE site
SET name = $1,
    address_street = $2,
    address_city = $3,
    address_state = $4,
    contract_begin = $5,
    site_info = $6,
    contract_end = $7,
WHERE site_id = $8
