const {Router} = require('express')
const path = require('path');
const config = require('config')
const Map = require('../models/Map')
const auth = require('../middleware/auth.middleware')
const router = Router()
const fs = require('fs');
router.post('/', auth, async (req, res) => {
  try {
    const {
      mapLink,
      mapWidthPx,
      cellSquareSize,
      widthInCells,
      heightInCells,
      } = req.body

    const file = req.files.file;
    const dirPath = path.join(__dirname, `../data/${req.user.userId}`);


    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }

    const map = new Map({
      mapLink,
      mapWidthPx,
      cellSquareSize,
      widthInCells,
      heightInCells,
      owner: req.user.userId,
      path: `/${req.user.userId}/${file.name}`
    })


      file.mv(`${dirPath}/${file.name}`)

    await map.save()

    res.status(201).json({ map })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    console.log(  path.join(__dirname, req.user.userId));
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
