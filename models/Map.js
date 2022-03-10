const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  owner: {type: Types.ObjectId, ref: 'User'},
  mapLink: {type: String, required: true},
  mapWidthPx: {type: Number, required: true},
  maHeightPx: {type: Number, required: false},
  cellSquareSize: {type: Number, required: true},
  widthInCells: {type: Number, required: true},
  heightInCells: {type: Number, required: true},
  path: {type: String, default: ''},
})

module.exports = model('Map', schema)

