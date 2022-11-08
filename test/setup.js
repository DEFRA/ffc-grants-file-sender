beforeEach(async () => {
    // ...
    // Set reference to server in order to close the server during teardown.
    const createServer = require('../app/server')
    // const mockSession = {
    //     getCurrentPolicy: (request, h) => true,
    //     createDefaultPolicy: (h) => true,
    //     updatePolicy: (request, h, analytics) => null,
    //     validSession: (request) => global.__VALIDSESSION__ ?? true,
    //     sessionIgnorePaths: []
    // }

    const server = await createServer()
    await server.start()
    global.__SERVER__ = server
    global.__VALIDSESSION__ = true
    global.__URLPREFIX__ = require('../app/config/server').urlPrefix
})
