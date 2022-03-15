import express from 'express'
import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import bcrypt from 'bcrypt'
import authenticate from '../../middleware/auth'

const route = express.Router()

router.post('/users', sanitizeBody, async (req, res) => {
  try {
    let newUser = new User(req.sanitizedBody)
    const itExists = Boolean(await User.countDcuments({ email: newUser.email }))
    if (itExists) {
      return res.status(400).json({
        errors: [
          {
            status: '400',
            title: 'Validation Error',
            detail: `Email address '${newUser.email}' is already registered.`,
            source: { pointer: '/data/attributes/email' },
          },
        ],
      })
    }

    await newUser.save()
    res.status(201).json(formatResponseData(newUser))
  } catch (err) {
    debug(err)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving document to the database.',
        },
      ],
    })
  }
})
router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody

  const user = await User.authenticate(email, password)
  if (!user) {
    return res.status(401).json({
      errors: [
        {
          status: '401',
          title: 'incorrect Paswword',
        },
      ],
    })
  }
  res
    .status(201)
    .json(formatResponseData({ accessToken: user.generateAuthToken() }))
})

router.get('/users/me', authenticate, async (req, res) => {
  const user - await User.findById()
  
  
  try {
    const car = await Car.findById(req.params.id).populate('owner')
    if (!car) {
      throw new Error('Resource not found')
    }
    res.send({ data: car })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

function formatResponseData(payload, type = 'users') {
  if (payload instanceof Array) {
    return { data: payload.map((resource) => format(resource)) }
  } else {
    return { data: format(payload) }
  }

  function format(resource) {
    const { _id, ...attributes } = resource.toJSON
      ? resource.toJSON()
      : resource
    return { type, id: _id, attributes }
  }
}

export default router
