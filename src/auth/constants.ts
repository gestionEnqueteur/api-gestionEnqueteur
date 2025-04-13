
const jwtSecret: string | undefined = process.env.JWT_SECRET
if(!jwtSecret)
    throw new Error("Application a besoin du JWTSecret")

export const jwtConstants = {
    secret: jwtSecret // || "Default secret Jwt, to be defined in .env",
}