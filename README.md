# node_skeleton
<br>
Add env credentials in config/config.json

 1. Genrate new migrations<br>
    - `sequelize migration:generate --name <name>` <br>

 2. Run migrations<br>
    - `sequelize db:migrate --env <name>` <br>
 3. Undo migrations<br>
    - `sequelize   db:migrate:undo` <br>     
    - `sequelize   db:migrate:undo:all` <br>
 4. Genrate new seeder<br>
    - `sequelize seed:generate`<br>   
 5. Run seeders<br>
    - `sequelize db:seed --seed <name>`<br>
    - `sequelize db:seed:all`
 6. Undo seeders<br>
    - `sequelize   db:seed:undo` <br>     
    - `sequelize   db:seed:undo:all` <br>
