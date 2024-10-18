const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta definida nas variáveis de ambiente ou 3000

// Configurações do banco de dados
const connection = mysql.createConnection({
    host: 'mysql.railway.internal',
    user: 'root',
    password: 'brYUnKHFzlISOSgmXgpEabtXkmLtAlII',
    database: 'railway'
});

// Configurações do CORS
const corsOptions = {
    origin: '*', // Permite todas as origens. Substitua por um URL específico se necessário.
    methods: ['GET', 'POST', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Rotas para adicionar geladeira, prateleira e amostra
app.post('/geladeiras', (req, res) => {
    const { nome, localizacao } = req.body;
    const query = 'INSERT INTO Geladeiras (nome, localizacao) VALUES (?, ?)';
    connection.execute(query, [nome, localizacao], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: results.insertId });
    });
});

app.post('mysql://root:brYUnKHFzlISOSgmXgpEabtXkmLtAlII@mysql.railway.internal:3306/railway/prateleiras', (req, res) => {
    const { id_geladeira, numero } = req.body;
    const query = 'INSERT INTO Prateleiras (id_geladeira, numero) VALUES (?, ?)';
    connection.execute(query, [id_geladeira, numero], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: results.insertId });
    });
});

app.post('mysql://root:brYUnKHFzlISOSgmXgpEabtXkmLtAlII@mysql.railway.internal:3306/railway/amostras', (req, res) => {
    const { nome, id_prateleira } = req.body;
    const query = 'INSERT INTO Amostras (nome, id_prateleira) VALUES (?, ?)';
    connection.execute(query, [nome, id_prateleira], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: results.insertId });
    });
});

// Rotas para deletar geladeiras, prateleiras e amostras
app.delete('mysql://root:brYUnKHFzlISOSgmXgpEabtXkmLtAlII@mysql.railway.internal:3306/railway/geladeiras/:id', (req, res) => {
    const query = 'DELETE FROM Geladeiras WHERE id_geladeira = ?';
    connection.execute(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ affectedRows: results.affectedRows });
    });
});

app.delete('mysql://root:brYUnKHFzlISOSgmXgpEabtXkmLtAlII@mysql.railway.internal:3306/railway/prateleiras/:id', (req, res) => {
    const query = 'DELETE FROM Prateleiras WHERE id_prateleira = ?';
    connection.execute(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ affectedRows: results.affectedRows });
    });
});

app.delete('mysql://root:brYUnKHFzlISOSgmXgpEabtXkmLtAlII@mysql.railway.internal:3306/railway/amostras/:id', (req, res) => {
    const query = 'DELETE FROM Amostras WHERE id_amostra = ?';
    connection.execute(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ affectedRows: results.affectedRows });
    });
});

// Rota para buscar amostras com geladeira e prateleira
app.post('mysql://root:brYUnKHFzlISOSgmXgpEabtXkmLtAlII@mysql.railway.internal:3306/railway/amostras/search', (req, res) => {
    const { nome } = req.body;
    const query = `
        SELECT 
            A.*, 
            P.numero AS prateleira, 
            G.nome AS geladeira 
        FROM Amostras A
        JOIN Prateleiras P ON A.id_prateleira = P.id_prateleira
        JOIN Geladeiras G ON P.id_geladeira = G.id_geladeira
        WHERE A.nome LIKE ?`;

    connection.execute(query, [`%${nome}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Inicia o servidor
connection.connect((err) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err);
    }
    console.log('Conectado ao banco de dados.');

    app.listen(PORT, () => {
        console.log(`Servidor rodando em hmysql://root:brYUnKHFzlISOSgmXgpEabtXkmLtAlII@mysql.railway.internal:3306/railway:${PORT}`);
    });
});