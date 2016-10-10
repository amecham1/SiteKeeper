insert into contract_days
  (site_id)
  values($1)
  RETURNING cd_id
