export const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: 'B1ngo Auth Api',
            version: '1.0.0',
            description: 'Api de autenticación para B1ngo',
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
            }
        ],
    },
    apis: ["./src/routes/*.ts"]
}