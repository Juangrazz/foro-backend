const CardCtrl = {};

const crypt = require('./crypt.controller');
const bbdd = require("../database");
const logger = require("../libs/winston");
var moment = require('moment');
const { StringDecoder } = require('string_decoder');

const decoder = new StringDecoder('utf8');

CardCtrl.getCards = async (req, res) => {
    logger.info(`Connecting to database...`, {
        __filename
    });

    try {
        let query = `SELECT c.id, DATE_FORMAT(STR_TO_DATE(c.date, "%Y-%m-%d"), "%d-%m-%Y") as date, c.time, c.place, c.instagram, c.description, publication_date, (SELECT count(*) FROM comments c2 WHERE card_id = c.id) AS comments FROM cards c WHERE STR_TO_DATE(substring(publication_date, 1, 10), "%d-%m-%Y") LIKE STR_TO_DATE("${req.params.date}", "%d-%m-%Y") ORDER BY publication_date`;

        logger.info(`Getting cards for day "${req.params.date}"...`, {
            __filename
        });
    
        bbdd.query(query, function (error, results, fields) {
            if (error) {
                logger.error(`An error has ocurred getting the cards. ${error}`, {
                    __filename
                });
                return;
            }
            logger.info(`Cards obtained: ${results.length}`, {
                __filename
            });

            logger.info(`Sending cards...`, {
                __filename
            });
    
            res.status(200).send(results);
        });
    } catch (error) {
        logger.error(`An error has ocurred connecting to database: ${error}`, {
            __filename
        });
    }
};

CardCtrl.getMymyvCards = async (req, res) => {
    logger.info(`Connecting to database...`, {
        __filename
    });

    try {
        let query = `SELECT mc.id, mc.age, mc.kind, mc.look_for, mc.instagram, mc.description, publication_date, (SELECT count(*) FROM comments mc2 WHERE card_id = mc.id) AS comments FROM mymyv_cards mc WHERE STR_TO_DATE(substring(publication_date, 1, 10), "%d-%m-%Y") LIKE STR_TO_DATE("${req.params.date}", "%d-%m-%Y") ORDER BY publication_date`;

        logger.info(`Getting cards for day "${req.params.date}"...`, {
            __filename
        });
    
        bbdd.query(query, function (error, results, fields) {
            if (error) {
                logger.error(`An error has ocurred getting the mymyv cards. ${error}`, {
                    __filename
                });
                return;
            }
            logger.info(`Mymyv cards obtained: ${results.length}`, {
                __filename
            });

            logger.info(`Sending cards...`, {
                __filename
            });
    
            res.status(200).send(results);
        });
    } catch (error) {
        logger.error(`An error has ocurred connecting to database: ${error}`, {
            __filename
        });
    }
};




























CardCtrl.createCard = async (req, res) => {
    logger.info(`Connecting to database...`, {
        __filename
    });
    try {
        var newCard = req.body;
        newCard.publication_date = moment().format("DD-MM-YYYY HH:mm:ss");
        newCard.publicated = 0;

        let query = `INSERT INTO cards(date, time, place, instagram, description, publicated, publication_date) VALUES("${newCard.date}", "${newCard.time}", "${newCard.place}", "${newCard.instagram}", "${newCard.description}", "${newCard.publicated}", "${newCard.publication_date}")`;

        logger.info(`Creating card... Executing query: "${query}"`, {
            __filename
        });

        bbdd.query(query, function (error, results, fields) {
            if (error) {
                logger.error(`Card does not created. ${error}`, {
                    __filename
                });
                res.status(400).json({
                    status: "KO",
                    message: "Card does not created"
                });
                return;
            }

            logger.info(`Card created`, {
                __filename
            });
            res.status(200).json({
                status: "OK",
                message: "Card created"
            });
        });
    } catch (error) {
        logger.error(`An error has ocurred connecting to database: ${error}`, {
            __filename
        });
    }
};

CardCtrl.createMymyvCard = async (req, res) => {
    logger.info(`Connecting to database...`, {
        __filename
    });
    try {
        var newMymyvCard = req.body;
        newMymyvCard.publication_date = moment().format("DD-MM-YYYY HH:mm:ss");
        newMymyvCard.publicated = 0;

        let query = `INSERT INTO mymyv_cards(age, kind, look_for, instagram, description, publicated, publication_date) VALUES("${newMymyvCard.age}", "${newMymyvCard.kind}", "${newMymyvCard.look_for}", "${newMymyvCard.instagram}", "${newMymyvCard.description}", "${newMymyvCard.publicated}", "${newMymyvCard.publication_date}")`;

        logger.info(`Creating mymyv card... Executing query: "${query}"`, {
            __filename
        });

        bbdd.query(query, function (error, results, fields) {
            if (error) {
                logger.error(`Mymyv card does not created. ${error}`, {
                    __filename
                });
                res.status(400).json({
                    status: "KO",
                    message: "Mymyv card does not created"
                });
                return;
            }

            logger.info(`Mymyv card created`, {
                __filename
            });
            res.status(200).json({
                status: "OK",
                message: "Mymyv card created"
            });
        });
    } catch (error) {
        logger.error(`An error has ocurred connecting to database: ${error}`, {
            __filename
        });
    }
};


module.exports = CardCtrl;