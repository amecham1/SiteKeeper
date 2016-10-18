SELECT DISTINCT name, address_street, address_city,address_state ,site_info,contract_begin,contract_end FROM site
JOIN user_schedule ON site.site_id = user_schedule.site_id_fk
WHERE user_id_fk = $1;
