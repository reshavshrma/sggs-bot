const axios = require('axios');
const cheerio = require('cheerio');
const { WAConnection, DisconnectReason } = require('@adiwajshing/baileys');

// Web scraping function (assuming basic title extraction)
async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('title').text().trim();
    return title;
  } catch (error) {
    console.error('Error scraping website:', error);
    return null; // Handle scraping errors gracefully
  }
}

// WhatsApp messaging function with error handling (made async)
async function sendWhatsAppMessage(groupID, message) {
  let conn;
  try {
    conn = new WAConnection();

    conn.on('qr', (qr) => {
      // Display QR code for user to scan (optional)
      console.log('Scan this QR code on WhatsApp:', qr);
    });

    conn.on('authenticated', () => {
      console.log('Connected to WhatsApp!');
    });

    conn.on('disconnected', async (reason) => {
      console.log('Disconnected from WhatsApp:', reason);
      if (reason === 'connection lost' || reason === 'logged out') {
        // Try to reconnect (optional)
        console.log('Reconnecting...');
        await conn.connect(); // Use await here for asynchronous reconnection
      }
    });

    conn.on('error', (error) => {
      console.error('Error connecting to WhatsApp:', error);
    });

    // Make the connection asynchronous to use await
    await conn.connect(); // Now, await is valid

    await conn.sendMessage(groupID, message);
    console.log('Message sent to group:', groupID);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  } finally {
    if (conn) {
      try {
        await conn.close(); // Close connection (optional)
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// Usage (wrapped in an async function)
(async () => {
  const scrapedData = await scrapeWebsite('https://www.sggs.ac.in/');
  console.log('Scraped data:', scrapedData);

  const groupID = 'https://chat.whatsapp.com/JRkNFdiPvQtGiTho246kQF'; // Replace with your group ID (without quotes)
  const message = 'Hello, this is a test message!';

  await sendWhatsAppMessage(groupID, message);
})();
