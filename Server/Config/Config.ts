import env from "dotenv";

env.config({
    path: "./.env",
    debug: false,
    encoding: "utf8",
    override: false,
})

const Config = {
    JWT_EXPIRES_IN: 60 * 60 * 12 * (Number(process.env.JWT_EXPIRES_IN_DAYS)),
    JWT_SECRET:process.env.JWT_SECRET,
    IS_PRODUCTION:process.env.NODE_ENV !== "development",
    PORT: process.env.PORT
}

export default Config