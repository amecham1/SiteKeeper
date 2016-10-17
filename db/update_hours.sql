UPDATE contract_times
SET firstshift_begin = $1,
    firstshift_end = $2,
    secondshift_begin = $3,
    secondshift_end = $4,
    thirdshift_begin = $5,
    thirdshift_end = $6,
    fourthshift_begin = $7,
    fourthshift_end = $8,
    contract_day = $9
WHERE contract_time_id = $10;
