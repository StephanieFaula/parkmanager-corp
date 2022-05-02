// Connexion à la db
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// On récupère nos variables d'environnements
require('dotenv').config({path:`${__dirname}/config/.env`});

module.exports = {
    add : async(req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        jwt.verify(token, process.env.JWT_SIGN_SECRET, async(err, data) => {
            if(err) {
                res.json({error: "Vous n'avez pas accès à ces ressources"})
            } 

            // On vérifie que l'utilisateur qui créer le nouveau compte est bien admin
            let adminUser = await db 
            .select('isAdmin')
            .from('user')
            .where({id: data.id})

        if(adminUser[0].isAdmin !== 0) {

            // On créer la nouvelle place
            let totalPlace = await db
                .select('*')
                .from('place')

            let newNumber = totalPlace.length + 1

            await db('place')
                .insert({placeNumber: newNumber})
        
            res.json({data: 'Votre place a bien été ajouté'})
        } else {
            res.json({data: 'Vos accès ne vous permettent pas d\'ajouter un nouvel utilisateur'})
        }
            
        })
    },

    delete : async(req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        let placeNumber = req.body.placeNumber

        jwt.verify(token, process.env.JWT_SIGN_SECRET, async(err, data) => {
            if(err) {
                res.json({error: "Vous n'avez pas accès à ces ressources"})
            } 

            // On vérifie que l'utilisateur est bien admin ou proprietaire de son vehicule qu'il souhaite supprimer
            let adminUser = await db 
                .select('isAdmin')
                .from('user')
                .where({id: data.id})

            if(adminUser[0].isAdmin !== 0 || idUser === data.id) {

                // On vérifie que la place existe
                let placeExist = await db
                    .select('*')
                    .from('place')
                    .where({placeNumber : placeNumber})

                if(placeExist.length) {
                    // On supprime le vehicule
                    await db('place')
                        .where({id: placeExist[0].id})
                        .del()                    
                    
                        res.json({data: "Cette place a bien été supprimée"})
                } else {
                    res.json({data: "Cette place n'existe pas"})
                }
                
            } else {
                res.json({data: 'Vos accès ne vous permettent pas de supprimer ce véhicule'})
            }
        })
    },
}