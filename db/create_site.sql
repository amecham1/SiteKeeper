insert into site
  (name,address_street,address_city,address_state,site_info,contract_begin,contract_end)
  values($1,$2,$3,$4,$5,$6,$7)
  returning site_id;
