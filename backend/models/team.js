var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TeamSchema   = new Schema({
    name: String,
    players: [{ id: Number, name: String }]
}, { versionKey: false });

var TeamModel = mongoose.model('Team', TeamSchema);

TeamSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret._id;
    }
});

module.exports = TeamModel;