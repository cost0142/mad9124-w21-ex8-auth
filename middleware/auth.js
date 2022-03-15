import res from 'express/lib/response'
import jwt from 'jsonwebtoken'
const jwtPrivateKey = 'superSecretKey'

function parseToken(headerValue) {
  if (headerValue) {
    const [type, token] = headerValue.split(' ') // ['Barer', 'kjeghvrbewrbvierw']
    if (type === 'bearer' && typeof token !== 'undefined') {
      return token
    }
  }
  return undefined
}

export default function (req, res, next) {
  const token = parseToken(req.header('Authorization'))
  if (!token) {
    return res.status(401).json({
      errors: [
        {
          status: '401',
          title: 'Authentication failed',
          description: 'missing',
        },
      ],
    })
  }
  const payload = jwt.verify(token, jwtPrivateKey)
  req.user = payload.user
  next()
} catch (err) {
    res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Authentication failed',
            description: 'missing',
          },
        ],

}
