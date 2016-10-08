SELECT name,address_street,address_city,address_state,contract_day,contract_begin,contract_end
FROM site
  JOIN contract_days ON site.site_id = contract_days.site_id
    JOIN contract_times ON contract_times.contract_days_fk = contract_days.cd_id
WHERE site.site_id = 1;
