// Connexion à la db
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// On récupère nos variables d'environnements
require('dotenv').config({path:`${__dirname}/config/.env`});

module.exports = {

    add : async(req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        let firstname = (req.body.firstname);
        let username = req.body.username;
        let isAdmin = Number(req.body.isAdmin)
        let pwd = req.body.pwd

        jwt.verify(token, process.env.JWT_SIGN_SECRET, async(err, data) => {
            if(err) {
                res.json({error: "Vous n'avez pas accès à ces ressources"})
            } 

            // On vérifie que cet utilisateur n'existe pas déjà
            let userAlreadyExist = await db
                .select('*')
                .from('user')
                .where({
                    firstname: firstname,
                    username: username
                })

            if (userAlreadyExist.length !== 0) {
                res.json({error: "Cet utilisateur existe déjà"})
            } else {
                // On vérifie que l'utilisateur qui créer le nouveau compte est bien admin
                let adminUser = await db 
                    .select('isAdmin')
                    .from('user')
                    .where({id: data.id})

                    console.log(adminUser[0].isAdmin)

                if(adminUser[0].isAdmin !== 0) {

                    // On ajoute le nouvel utilisateur
                    await db('user')
                        .insert({firstname: firstname, username: username, isAdmin: isAdmin, pwd: pwd})
                
                    res.json({data: 'Votre utilisateur a bien été ajouté'})
                } else {
                    res.json({data: 'Vos accès ne vous permettent pas d\'ajouter un nouvel utilisateur'})
                }
            }
            
        })
    },

    delete : async(req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        let idUser = Number(req.body.idUser);

        jwt.verify(token, process.env.JWT_SIGN_SECRET, async(err, data) => {
            if(err) {
                res.json({error: "Vous n'avez pas accès à ces ressources"})
            } 

            // On vérifie que l'utilisateur est bien admin ou proprietaire de son compte qu'il souhaite supprimer
            let adminUser = await db 
                .select('isAdmin')
                .from('user')
                .where({id: data.id})

            if(adminUser[0].isAdmin !== 0 || idUser === data.id) {

                // On supprime utilisateur
                await db('user')
                        .where({id: idUser})
                        .del()                    
                    res.json({data: "Cet utilisateur a bien été supprimée"})
            
            } else {
                res.json({data: 'Vos accès ne vous permettent pas de supprimer un utilisateur'})
            }
        })
    },

    update : async(req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        let idUser = req.body.idUser;

        jwt.verify(token, process.env.JWT_SIGN_SECRET, async(err, data) => {
            if(err) {
                res.json({error: "Vous n'avez pas accès à ces ressources"})
            } 

            // On vérifie que l'utilisateur est bien admin ou proprietaire de son compte qu'il souhaite modifier
            let adminUser = await db 
                .select('isAdmin')
                .from('user')
                .where({id: data.id})

            if(adminUser[0].isAdmin !== 0 || idUser === data.id) {

                // Update
                if(req.body.length !== 0) { 

                    if(req.body.firstname) {
                        await db
                        .where({ id: idUser })
                        .from('user')
                        .update({ firstname: req.body.firstname })

                        res.json({data: 'Le compte a bien été mis à jour'})
                    }
                    if(req.body.username) {
                        await db
                        .where({ id: idUser })
                        .from('user')
                        .update({ username: req.body.username })

                        res.json({data: 'Le compte a bien été mis à jour'})
                    }
                    if(req.body.pwd) {
                        await db
                        .where({ id: idUser })
                        .from('user')
                        .update({ pwd: req.body.pwd })

                        res.json({data: 'Le compte a bien été mis à jour'})
                    }
                    
                    res.json({data : 'Il n\'y a pas de données à mettre à jour'})
                } 
            } else {
                res.json({data: 'Vos accès ne vous permettent pas de supprimer un utilisateur'})
            }
        })
    },



    login : async(req, res) => {

        let username = req.body.username;
        let firstname = req.body.firstname;
        let pwd = req.body.pwd

        try {

            let userFound = await db
                .select('id', 'username', 'firstname', 'pwd')
                .from('user')
                .where({
                    username: username,
                    firstname: firstname
                })
                            
                if (userFound.length == 0 || userFound[0].pwd != pwd) {
                    res.json({error: "Vos identifiants sont inccorects. Veuillez vérifier votre nom, prénom et mot de passe."})
                }

                if(userFound && userFound[0].pwd === pwd) {
                    // Création du token lorsque l'utilisateur est authentifié
                    const jwtToken = jwt.sign(
                        {
                            id: userFound[0].id,
                            connected: true
                        }, 
                        process.env.JWT_SIGN_SECRET
                    )
                    // Envoi du token
                    res.json({token: jwtToken})
                }

        } catch (error) {
            console.log(error)
        }   
    },

    logged : async (req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        if (token) {
            jwt.verify(token, process.env.JWT_SIGN_SECRET, (err, data) => {
                if(err) {
                    res.sendStatus(403)
                } else {
                    res.json({data: data})
                }
    
            })
        }
    }
}