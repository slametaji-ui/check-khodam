const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import middleware CORS
const app = express();

// Middleware untuk parse application/json
app.use(bodyParser.json());

// Gunakan middleware CORS
app.use(cors());

// Data array yang berisi kata-kata yang akan diambil secara acak
const data = ['Tidak Ada',
    "Harimau Biskuat", "Nyi Ngaborong", "Jin Sarimi", "Maung Ompong",
    "Gajah Bule", "Kelinci Pitih", "Kambing Hitam", "Bebek Sumberkencono",
    "Ikan Bakar", "Kucing Nakal", "Laba-Laba Sutra", "Ular Kejut",
    "Burung Kutang", "Sapi Perah", "Kuda Lumping", "Kuda Laut",
    "Ayam Geprek", "Cacing Ganteng", "Buaya Darat", "Kucing Garong",
    "Unta Gila", "Tikus Got", "Kambing Guling", "Babi Ngepet","Dino Jahat",
    "Ular Madu", "Ayam Kampus", "Gajah Mada", "Kodok Ngorek",
    "Anjing Gukguk", "Kera Sakti", "Burung Cendrawasih", "Kadal Gurun",
    "Biawak Air", "Tupai Terbang", "Lele Jumbo", "Belut Listrik",
    "Kura-Kura Ninja", "Ikan Tongkol", "Kucing Manja", "Bebek Balap",
    "Burung Hantu", "Serigala Malam", "Ikan Pari", "Kodok Terbang",
    "Ayam Cemani", "Banteng Merah", "Gorila Sakit Gigi", "Ular Sanca", "Ular Kobra",
    "Rusa Kutub", "Burung Kolibri", "Buto Ijo", "Pocong Unyu","Dino Jahat",
    "Kuntilanak Merah", "Sundel Bolong", "Genderuwo Keren", "Wewe Gombel",
    "Tuyul Nakal", "Jelangkung Seram", "Kuntilanak Manis", "Buto Terong",
    "Jurig Kampring", "Setan Budug", "Hantu Kompor", "Memedi Sawah",  "Kucing Kecurangan", "Macan Ketipu", "Harimau Ketabrak", "Kucing Kekepung", "Macan Keliru", 
    "Harimau Kembar", "Kucing Kerdil", "Macan Ketangkap", "Harimau Kemaruk", "Kucing Kebagian", 
    "Macan Ketinggalan", "Harimau Kemben", "Kucing Kepanasan", "Macan Kepanjangan", "Harimau Kembaran", 
    "Kucing Kekeret", "Macan Keselek", "Harimau Kesurupan", "Kucing Kekampungan", "Macan Kempes", 
    "Harimau Kelas Teri", "Kucing Keletihan", "Macan Kekeringan", "Harimau Kejang", "Kucing Kera", 
    "Macan Kerucut", "Harimau Keriting", "Kucing Kesasar", "Macan Kesasar", "Harimau Kentut","Dino Jahat","Dino Jahat"
    ];

app.get('/', (req, res) => {
        res.send('Hello from Express on Vercel!');
});

// Route untuk handle POST request
app.post('/api/data', (req, res) => {
    const { nama } = req.body;

    // Generate index acak dari array data
    const randomIndex = Math.floor(Math.random() * data.length);

    // Kirim response berupa kata acak dari data berdasarkan nama yang diinput
    res.json({
        nama,
        data: data[randomIndex]
    });
});

module.exports = app;
