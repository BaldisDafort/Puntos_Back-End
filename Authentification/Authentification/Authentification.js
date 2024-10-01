const app = express()
const port = 3000
app.use(express.json());
let MongoClient = require('mongodb').MongoClient;
let mongodb = require('mongodb');
let url = "mongodb://localhost:27017/";
app.get('/taches', (req, res, next) => {
    try {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            let dbo = db.db("taches");
            dbo.collection("taches").find({}).toArray((err,
            datas) => {
                console.log(datas);
                res.status(200).json(datas);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false });
    }
});
app.listen(port, () => {
    console.log(`L'application écoute le port ${port}`)
})
