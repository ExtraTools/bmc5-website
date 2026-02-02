const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');

// Middleware для статических файлов
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/status', async (req, res) => {
    // TODO: Интеграция с MCStatus
    res.json({
        online: true,
        players: {
            online: 5,
            max: 20
        },
        version: "1.21.1",
        motd: "BMC5 Server"
    });
});

app.get('/api/mods', (req, res) => {
    // TODO: Чтение из файла
    res.json([
        { name: "Alex's Mobs", version: "1.22.16", category: "Mobs" },
        { name: "Create", version: "0.5.1", category: "Tech" }
    ]);
});

app.get('/api/players', (req, res) => {
    res.json([
        { name: "Somni", skin: "default" }
    ]);
});

// Fallback на главную страницу
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`============================================`);
    console.log(`   BMC5 Website Server running on Port ${PORT}`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`============================================`);
});
