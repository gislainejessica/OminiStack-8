const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        //console.log(req.io, req.connectedUsers)
        const { user }  = req.headers;
        const { devId } = req.params;
        const loggedDev = await Dev.findById(user);
        const targedDev = await Dev.findById(devId);
        //console.log(targedDev, loggedDev, loggedDev._id)

        if (!targedDev) {
            return res.status(400).json({erro: " Desenvolvedor not exists  "}); 
        }

        // Aula avançada
        if (targedDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[user]
            const targedSocket = req.connectedUsers[devId]
            //console.log(loggedDev, targedDev)
            console.log("Deu match nos usuarios")

            if (loggedSocket) { req.io.to(loggedSocket).emit('deuMatch' , targedDev); }
            if (targedSocket) { req.io.to(targedSocket).emit('deuMatch' , loggedDev); }
        }
        // ... Fim da aula avançada

        loggedDev.likes.push(targedDev._id);
        loggedDev.save();
        return res.json(loggedDev)
    }
};