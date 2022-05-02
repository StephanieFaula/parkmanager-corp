// Connexion à la db
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const moment = require('moment');

// On récupère nos variables d'environnements
require('dotenv').config({path:`${__dirname}/config/.env`});

module.exports = {

    add : async(req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        let matricule = Number(req.body.matricule);
        let user_id = Number(req.body.user_id);

        jwt.verify(token, process.env.JWT_SIGN_SECRET, async(err, data) => {
            if(err) {
                res.json({error: "Vous n'avez pas accès à ces ressources"})
            } 

            // On vérifie que ce matricule n'existe pas déjà
            let vehiculeAlreadyExist = await db
                .select('*')
                .from('vehicule')
                .where({
                    matricule: matricule
                })

            if (vehiculeAlreadyExist.length !== 0) {
                res.json({error: "Ce vehicule existe déjà"})
            } else {

                // On ajoute le nouvel utilisateur
                await db('vehicule')
                    .insert({matricule: matricule, user_id: user_id})
                
            }
            
        })
    },

    delete : async(req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        let idUser = Number(req.body.idUser);
        let matricule = Number(req.body.matricule)


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

                // On vérifie que le véhicule existe
                let vehiculeExist = await db
                    .select('*')
                    .from('vehicule')
                    .where({matricule : matricule})

                if(vehiculeExist.length) {
                    // On supprime le vehicule
                    await db('vehicule')
                        .where({id: vehiculeExist[0].id})
                        .del()                    
                    
                        res.json({data: "Ce véhicule a bien été supprimée"})
                } else {
                    res.json({data: "Le véhicule n'existe pas"})
                }
                
            } else {
                res.json({data: 'Vos accès ne vous permettent pas de supprimer ce véhicule'})
            }
        })
    },

    update : async(req, res) => {
        let headerAuth = req.headers.authorization;
        let token = headerAuth.replace('Bearer ', '');

        let matricule = Number(req.body.matricule)


        jwt.verify(token, process.env.JWT_SIGN_SECRET, async(err, data) => {
            if(err) {
                res.json({error: "Vous n'avez pas accès à ces ressources"})
            } 

            // On va chercher les infos du véhicule
            let vehicule = await db
                .select('*')
                .from('vehicule')
                .where({matricule: matricule})

            if(vehicule.length){ 

                // On vérifie que l'utilisateur est bien admin ou proprietaire de son vehicule qu'il souhaite modifier
                let adminUser = await db 
                    .select('isAdmin')
                    .from('user')
                    .where({id: data.id})

                if(adminUser[0].isAdmin !== 0 || vehicule[0].user_id === data.id) {

                    // Update
                    if(req.body.length !== 0) { 

                        if(vehicule[0].parked_at) {
                            let tmp = new Date(vehicule[0].parked_at) - new Date(Date.now())

                            // On ajoute le temps calculé au temps d'occupation
                            let ajoutTemps = vehicule[0].total_occupation + tmp

                            await db
                                .where({id: vehicule[0].id})
                                .from('vehicule')
                                .update({total_occupation: ajoutTemps})

                            // On libère la place
                            await db
                                .where({vehicule_id: vehicule[0].id})
                                .from('place')
                                .update({
                                    parked_at: null,
                                    vehicule_id: null
                                })

                            // On retire le véhicule de la place
                            await db
                                .where({id: vehicule[0].id})
                                .from('vehicule')
                                .update({parked_at: null})

                            res.json({data: `Le véhicule ${vehicule[0].matricule} a été retiré de la place`})


                        } else {
                            // On assigne le véhicule à une place libre

                                // On cherche une place libre
                                let placeLibre = await db
                                    .select('id')
                                    .from('place')
                                    .where({parked_at: null})

                                // On bloque une place et on assigne un vehicule à la place bloqué
                                if(placeLibre[0].length !== 0) {
                                    await db
                                        .where({id: placeLibre[0].id})
                                        .from('place')
                                        .update({
                                            parked_at: moment().format('YYYY-MM-D hh:mm:ss'),
                                            vehicule_id: vehicule[0].id
                                        })

                                    await db
                                    .where({user_id: vehicule[0].user_id})
                                    .from('vehicule')
                                    .update({parked_at: moment().format('YYYY-MM-D hh:mm:ss')})

                                    res.json({data: `Votre véhicule à bien été assigné à la place ${placeLibre[0].id}`})
                                }
                        }
                    } 
                
                } else {
                    res.json({data: 'Vos accès ne vous permettent pas de supprimer ce véhicule'})
                }
            } else {
                res.json({data: 'Ce véhicule n\'existe pas'})
            }
        })
    },

}