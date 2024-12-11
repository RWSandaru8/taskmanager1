import path from "path";
import fs from 'fs';
import { NextRequest, NextResponse } from "next/server";

const taskFile = path.join(process.cwd(), 'data', 'task.json');

function ensureDir(){
    const dir = path.join(process.cwd(), 'data');
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

function readTasks(){
    ensureDir();
    if(!fs.existsSync(taskFile)){
        return [];
    }
    const content = fs.readFileSync(taskFile, 'utf-8');
    return JSON.parse(content);
}

function pushTask(tasks: any[]){
    ensureDir();
    fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
}

export async function POST(request: NextRequest) {
    try{
        const task = await request.json();
        const tasks = readTasks();
        tasks.push(task)
        pushTask(tasks);
        return NextResponse.json({
            massage: "Task added successfully",
            task
        }, {status: 200})
    }
    catch(error){
        console.error("Error adding task!", error);
        return NextResponse.json({
            message: "Failed to add the task!"
        }, 
        {status: 500});
    }
}