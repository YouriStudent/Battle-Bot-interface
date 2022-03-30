const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const Bots = require('../../classes/bots.js')
const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 3003
});

var games = [];

wss.on('connection', (client, req) => {
    console.info("Total connected clients:", wss.clients.size);
    sendMessageToInterface({"total_connected": wss.clients.size});
    setAttributeToClient("isAlive", true, client);

    client.on('message', message => {
        if (isValidJSONString(message)) {
            let req = JSON.parse(message);
            console.log(req);
            sendMessageToInterface(req)
            switch (req.action) {
                case "login":
                    login(client, req);
                    break;
                case "prepare":
                    if (ready(req.for)) {
                        createGame(req);
                        sendActionToBot(req);
                        setAttributeToClient("preparing", false, client);
                        sendMessageToInterface({
                            "games": games
                        })
                    } else {
                        sendMessageToClient(client, {
                            "error": "NOT_READY"
                        })
                    }
                    break;
                case "start":
                    if(preparingDone()){
                        sendActionToBot(req);
                        updateGameStatus(req);
                    }else{
                        sendMessageToClient(client, {
                            "error": "NOT_READY"
                        })
                    }
                    break;
                case "ended":
                    sendActionToBot(req);
                    break;
            }

            switch (req.status) {
                case true:
                    setAttributeToClient("preparing", true, client);
                    break;
                case "preparing_game":
                case "ready":
                case "in_game":
                case "finished":
                    if (client.status !== req.status) {
                        sendMessageToInterface({
                            "games": games
                        })
                        updateBotStatusInGame(client.id, req.status);
                    }
                    case "preparing":
                        setAttributeToClient("status", req.status, client)
                        break;

            }


            if (req.error) {
                sendMessageToInterface({
                    "status": true,
                    "games": games
                })
            }


        } else {
            client.send(JSON.stringify({
                "error": "INVALID_JSON"
            }))
        }

    });

    client.on('pong', () => {
        heartbeat(client)
    })

    client.on('close', () => {
        console.info("Total connected clients:", wss.clients.size);
    })


})

const heartbeat = (client) => {
    client.isAlive = true;
}

/**
 * Set a custom attribute to a client
 * @param {String} name 
 * @param {*} value 
 * @param {WSS Client} target 
 */
const setAttributeToClient = (name, value, targets = "all") => {
    if (targets == "all") {
        wss.clients.forEach((client) => {
            if (client.role == "bot") {
                client[name] = value;
            }
        })
    } else if(Array.isArray(targets)) {
        targets.forEach((target) => {
            wss.clients.forEach((client) => {
                if(client.id == target){
                    client[name] = value;
                }
            })
        })
    }else{
        targets[name] = value;
    }
}

const interval = setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.isAlive === false) {
            return client.terminate()
        }

        client.isAlive = false
        client.ping()
    })
}, 5000)

function updateGameStatus(body){

}

function addBotToGame(status, target = "all") {
    if (target == "all") {
        wss.clients.forEach((client) => {
            if (client.role == "bot") {
                games["all"].bots.push({
                    "botId": client.id,
                    "status": status
                });
            }
        })
    }
}

function updateBotStatusInGame(client, status) {

}

function preparingDone(targets = "all"){
    let ready = false
    if (targets == "all") {
        wss.clients.forEach((client) => {
            if (client.role == "bot") {
                if (client.preparing) {
                    ready = true
                } else {
                    ready = false;
                }
            }
        });
    } else {
        for (let i of targets) {
            wss.clients.forEach((client) => {
                if (client.id == i) {
                    if (client.preparing) {
                        ready = true;
                    } else {
                        ready = false;
                    }
                }
            })
        }
    }

    return ready;
}

function sendActionToBot(message) {
    let body = {
        "action": message.action,
        "game": message.game
    }

    if (message.for == "all") {
        sendMessageToAllBots(body);
    } else {
        message.for.forEach((botId) => {
            wss.clients.forEach((client) => {
                if (client.id == botId) {
                    sendMessageToClient(client, body)
                }
            })
        })
    }
}

/**
 * Log client in and give them role and id
 * @param {WSS Client} client 
 * @param {Object} req 
 */
function login(client, req) {
    if (req.key == "111") {
        setAttributeToClient("role", "admin", client);
        client.send(JSON.stringify({
            "games": games
        }));
    } else {
        setAttributeToClient("role", "bot", client);
        sendMessageToClient(client, {
            "loggedin": true
        });

    }
    setAttributeToClient("id", req.id, client);
}

/**
 * Send JSON String to all bots that are connected
 * @param {Object} message 
 */
function sendMessageToAllBots(message) {
    wss.clients.forEach((client) => {
        if (client.role == "bot") {
            client.send(JSON.stringify(message));
        }
    })
}

/**
 * Send JSON String to admin/admins
 * @param {Object} message 
 * @param {WSS client} target default = all admins 
 */
function sendMessageToInterface(message, target = "all") {
    if (target == "all") {
        wss.clients.forEach((client) => {
            if (client.role == "admin") {
                client.send(JSON.stringify(message));
            }
        })
    } else {
        target.send(JSON.stringify(message));
    }
}

/**
 * Checks if bots are ready to play a game
 * @param {String || Array} target botId
 * @returns true || false
 */
function ready(target, action = "") {
    let ready = false
    if (target == "all") {
        wss.clients.forEach((client) => {
            if (client.role == "bot") {
                if (client.status == "ready") {
                    ready = true
                } else {
                    ready = false;
                }
            }
        });
    } else {
        for (let i of target) {
            wss.clients.forEach((client) => {
                if (client.id == i) {
                    if (client.status == "ready") {
                        ready = true;
                    } else {
                        ready = false;
                    }
                }
            })
        }
    }

    return ready;
}


/**
 * Start game for all bots
 * @param {Sring} game name of the game
 * @param {String} action action: prepare. start OR ended
 */
function sendActionToAllBots(game, action) {
    if (action == "prepare") {
        games["all"] = {
            "games": game,
            "action": "preparing_game",
            "bots": []
        };

        addBotToGame("preparing_game");

        setAttributeToClient("game", game);

    }

    sendMessageToAllBots({
        "game": game,
        "action": action
    })
    sendMessageToInterface({
        "status": true,
        "action": action,
        "games": games["all"],
        "for": "all"
    })
}

/**
 * Creates game and push to Arry
 * @param {Object} req 
 */
function createGame(req) {
    let game = {
        "id": uuidv4(),
        "game": req.game,
        "status": req.action,
        "bots": []
    }
    let bots = [];
 

    wss.clients.forEach((client) => {
        if(client.role == "bot"){
            if(req.for == "all"){
                bots.push({"botId": client.id, "status": client.status}) 
            }else{
                if(req.for.includes(client.id)){
                    bots.push({"botId": client.id, "status": client.status})
                }
            }
        }
    })

    game.bots = bots

    games.push(game);
}

/**
 * Send JSON String to client 
 * @param {WSS client} client 
 * @param {Object} message  
 */
function sendMessageToClient(client, message) {
    client.send(JSON.stringify(message));
}

/**
 * Check is String is a valid json string
 * @param {String} str 
 * @returns true OR false
 */
function isValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports = router;





// switch (body.action) {
//     case "login":
//         if (body.key == "111") {
//             setAttributeToClient("role", "admin", client);
//             client.send(JSON.stringify(games));
//         } else {
//             setAttributeToClient("role", "bot", client);
//             client.send(JSON.stringify({
//                 "loggedin": true
//             }));
//         }
//         setAttributeToClient("id", body.id, client);
//         break;
//     case "prepare":
//     case "start":
//         if (client.role == "admin") {
//             if (body.for == "all" && ready() && body.action != "ended") {
//                 sendActionToAllBots(body.game, body.action);
//             }else {
//                 sendMessageToInterface({
//                     "status": false,
//                     "msg": "NOT_READY"
//                 }, client)
//             }
//         } else {
//             client.send(JSON.stringify({
//                 "error": "UNAUTHORIZED"
//             }))
//         }
//         break;
//     case "ended":
//         sendActionToAllBots(body.game, body.action);
//         break;
// }

// sendMessageToInterface({"message": body, "botId": client.id});

// if (body.status && client.role == "bot") {
//     switch (body.status) {
//         case "preparing":
//             setAttributeToClient("status", body.status, client)
//             break;
//         case "preparing_game":
//         case "ready":
//         case "in_game":
//         case "finished":
//             // update client status in game
//             if (games["all"]) {
//                 games["all"].bots.forEach((bot) => {
//                     if (bot.id == client.id && bot.status != body.status) {
//                             bot.status = body.status
//                             // send games to admins
//                             sendMessageToInterface({
//                                 "games": games["all"]
//                             })
//                     }

//                 })
//             }
//             // update client status
//             setAttributeToClient("status", body.status, client)
//             break;
//     }

//     // wss.clients.forEach(function each(client) {
//     //     if (client.role == "bot") {}
//     // });
// }

// if (body.error) {
//     sendMessageToInterface({
//         "status": true,
//         "game": games
//     })
// }