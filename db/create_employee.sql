insert into employee
  (first_name,last_name,admin,email,password)
  values($1,$2,$3,$4,$5)
  returning user_id
