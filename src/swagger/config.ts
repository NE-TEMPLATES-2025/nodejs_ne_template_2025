import swaggerAutoGen from 'swagger-autogen'



const doc={
    info:{
         title: 'NE TEMPLATE',
         description: 'NE 2025 TEMPLATE APIs'
    },
    host: "http://localhost:5000",
    basePath: "/api/v1/",
    consumes:["application/json"],
    produces:["application/json"],

    tags: [
        {
            name: 'Auth',
            description: 'Authentication endpoints'
        },
        {
            name: 'Users',
            description: 'Users endpoints'
        },
    ],
    securityDefinitions:{
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    }

    
}
const outputFile= "./swagger.json"
const routes= ["./src/routes/auth.routes.ts","./src/routes/user.routes.ts"]

swaggerAutoGen(outputFile,routes,doc)