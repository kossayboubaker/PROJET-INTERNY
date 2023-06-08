
const mysql = require('mysql2');

// get ALL offres
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const offreadminController = {

    view: async (req, res) => {

        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);


            // User the connection
            connection.query('SELECT * from offre ', (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('offre-admin', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });
        });
    },

    // Find  offre by search
    find: async (req, res) => {

        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            let searchTerm = req.body.search
            // User the connection
            connection.query('SELECT o.*, s.url, s.nom_societe FROM offre o INNER JOIN societe s ON o.societe_id = s.id where o.specialite like ? OR o.titre like ? OR s.nom_societe like ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('offre-admin', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });
        });

    },

    form: async (req, res) => {
        res.render('offre-admin');
    },

    create: async (req, res) => {
        console.log(req.body);

        const { titre, descpt, date_debut, date_fin, dateexp, specialite, nom_societe } = req.body;


        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            connection.query('SELECT id FROM societe WHERE nom_societe = ?', [nom_societe], (err, rows) => {
                const id = rows[0].id;
                // User the connection
                connection.query('INSERT INTO offre SET titre = ?, descpt = ?, date_debut = ?, date_fin = ?, dateexp = ?, specialite = ? , societe_id = ?', [titre, descpt, date_debut, date_fin, dateexp, specialite, id], (err, rows) => {
                    // when done with the connection, release it
                    connection.release();

                    if (!err) {
                        res.render('publier-offre');
                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table: \n', rows);
                });




            });


        });

    },
    editform: async (req, res) => {
        res.render('modifie-offreadmin');
    },
    edit: async (req, res) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);


            // User the connection
            connection.query('SELECT * From offre where id = ?', [req.params.id], (err, rows) => {
                // when done with the connection, release it

                connection.release();
                rows = rows[0];
                console.log(rows);
                //change the date format
                rows.date_debut = rows.date_debut.toISOString().split('T')[0];
                rows.date_fin = rows.date_fin.toISOString().split('T')[0];
                rows.dateexp = rows.dateexp.toISOString().split('T')[0];

                if (!err) {
                    console.log(req.params.id);
                    res.render('modifie-offreadmin', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from offre table: \n', rows);

            });
        });
    },
}



module.exports = offreadminController;

