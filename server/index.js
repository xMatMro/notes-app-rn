import express, { json } from "express";
import { getTasks, saveNotes, getNotes } from "./db/dbcontroller.js"
import { ObjectId } from "mongodb";
import cors from 'cors'

const app = express()
const PORT = 3001;
app.use(json())
app.use(cors())
app.get("/api/task", async (req, res) => {
    const tasks = await getTasks();
    console.log(idd);

    res.status(200).json(tasks);
})
app.post("/api/save", async (req, res) => {
    try {
        const items = req.body.items

        const parsedItems = items.map((e, i) => {
            const id = new ObjectId()
            return { _id:id, ...e }
        })
        saveNotes(parsedItems)
        res.status(200).json({msg:'OK'})
    } catch (e) {
        res.status(500).json({ error: "Server error" })
    }
})
app.get("/api/get",async(req,res)=>{
    const items = await getNotes()
    res.json(items)
})
app.listen(PORT, () => { console.log(`http://localhost:${PORT}`) })