SELECT * FROM site
JOIN contract_times ON contract_times.site_id_fk = site.site_id;
-- WHERE contract_times.site_id_fk = '$1'
