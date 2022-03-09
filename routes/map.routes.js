const {Router} = require('express')
const config = require('config')
const Map = require('../models/Map')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/', auth, async (req, res) => {
  try {
    const {
      mapLink,
      mapWidthPx,
      cellSquareSize,
      widthInCells,
      heightInCells,
      } = req.body

    console.log(mapLink,
      mapWidthPx,
      cellSquareSize,
      widthInCells,
      heightInCells, req.user.userId
      )

    const map = new Map({
      mapLink,
      mapWidthPx,
      cellSquareSize,
      widthInCells,
      heightInCells,
      owner: req.user.userId
    })

    await map.save()

    res.status(201).json({ map })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const links = await Map.find({ owner: req.user.userId })
    res.json(links)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// router.get('/:id', auth, async (req, res) => {
//   try {
//     const link = await Map.findById(req.params.id)
//     res.json(link)
//   } catch (e) {
//     res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
//   }
// })

module.exports = router
