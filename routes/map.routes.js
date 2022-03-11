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
      mapName,
      mapWidthPx,
      cellSquareSize,
      widthInCells,
      heightInCells,
      } = req.body

    const file = req.files.file;
    const dirPath = path.join(__dirname, `../${config.get('staticDir')}/${req.user.userId}`);


    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }

    const map = new Map({
      mapName:`${mapName}.${file.name.split('.').pop()}`,
      mapWidthPx,
      cellSquareSize,
      widthInCells,
      heightInCells,
      owner: req.user.userId,
    })


    file.mv(path.join(dirPath, `${mapName}.${file.name.split('.').pop()}`))
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

router.delete('/', auth, async (req, res) => {
  try {
    const dirPath = path.join(__dirname, `../${config.get('staticDir')}/${req.user.userId}`);
    fs.unlink(`${dirPath}/9fecdba47cfcda751e4eadce08ff95a7.jpg`, (err => {
      if (err) res.status(500).json({ message: err.message });
      else {
        console.log("\nDeleted file: example_file.txt");
        res.json({ message: 'Файл удален' })
      }
    }));
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})


module.exports = router
