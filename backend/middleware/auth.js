import jwt from "jsonwebtoken"

const getJwtSecret = () => process.env.JWT_SECRET || "development-secret-change-me"

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || ""
    const [scheme, token] = authHeader.split(" ")

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ success: false, message: "Authentication required." })
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret())
        req.userId = decoded.id
        req.authUser = decoded
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired session." })
    }
}

export default authMiddleware