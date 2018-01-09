const os = require('os')
const path = require('path')
const fs = require('fs')
const TMPDIR = os.tmpdir()
const port = 10003
var map = L.map('map').setView([38,114], 3);
L.TileLayer.Kitten = L.TileLayer.extend({
    getTileUrl: function(coords) {
        var local = path.resolve(TMPDIR,`BPA/map/site/${coords.z}/${coords.x}/${coords.y}.png`)
        var stat = fs.existsSync(local)
        if(stat) {
            return local
        } else {
            return `http://localhost:${port}/256/${coords.z}/${coords.x}/${coords.y}?access_token=pk.eyJ1IjoibXVtdTEyMzQzIiwiYSI6ImNqYnllMHNyeDMzZmczM3Iwc3dtZmQzbzQifQ.ODES4bDIuqe-bjL8dx0XWg`
        }
    },
    getAttribution: function() {
        return "<a href='http://placekitten.com/attribution.html'>华风创新</a>"
    },
});
L.tileLayer.kitten = function() {
    return new L.TileLayer.Kitten();
}
L.tileLayer.kitten().addTo(map);
