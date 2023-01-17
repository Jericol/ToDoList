const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();  

// Leyendo la Api
const jsonPath = path.resolve('./files/tasks.json');

// recibiendo todos los methodos
app.use(express.json());

// Obtener Todas las tareas
app.get('/tasks', async (req, res) =>{
    const jsonFile = await fs.readFile(jsonPath, 'utf8')
    res.send(jsonFile);
});

// Crear una tarea 
app.post('/tasks', async (req, res) =>{
    const newHomeWork = req.body;
    const newArrayWork = JSON.parse(await fs.readFile(jsonPath, 'utf8' ));
    const lastIndex = newArrayWork.length - 1;
    const newId = newArrayWork[lastIndex].id + 1;
    newArrayWork.push({...newHomeWork, id: newId});
    await fs.writeFile(jsonPath, JSON.stringify(newArrayWork)); 
    res.end();
});

// Actualizacion de tareas 
app.put('/tasks', async (req, res) =>{
    const newArrayWork = JSON.parse(await fs.readFile(jsonPath, 'utf8' ));
    const { completed, id } = req.body;
    const newLast = newArrayWork.findIndex(task => task.id === id);
    if (newLast >= 0) {
        newArrayWork[newLast].completed = completed;
    }
    await fs.writeFile(jsonPath, JSON.stringify(newArrayWork));
    res.send('tarea actualizada');
});

// eliminando tareas
app.delete('/tasks', async (req, res) =>{
    const newArrayWork  = JSON.parse(await fs.readFile(jsonPath, 'utf8' ));
    const { id } = req.body;
    const newLast = newArrayWork.findIndex(task => task.id === id);
    newArrayWork.splice(newLast, 1);
    await fs.writeFile(jsonPath, JSON.stringify(newArrayWork));
    res.end('tarea eliminada');
});

// Generando el puerto del servidor 
const PORT =  8000;

app.listen(PORT, () =>{
    console.log(`abriendo puerto ${PORT}`)
})