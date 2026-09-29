-- Keep the portfolio project linked to the repository being developed.
update public.projects
set front_url = 'https://github.com/Lucas-Amaral-dom/remix-developer-portfolio'
where title = 'Portfólio RPG'
   or front_url = 'https://github.com/Lucas-Amaral-dom/portfolio';
