const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  owner: {type: Types.ObjectId, ref: 'User'},
  mapName:{type: String, required: true, unique: true},
  mapWidthPx: {type: Number, required: false},
  cellSquareSize: {type: Number, required: false},
  widthInCells: {type: Number, required: false},
  heightInCells: {type: Number, required: false},
})

module.exports = model('Map', schema)

