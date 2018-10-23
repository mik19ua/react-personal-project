import { MAIN_URL, TOKEN } from './config';

const fetchTasks = async () => {
    const response = await fetch(MAIN_URL, {
        method:  'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization:  TOKEN,
        },
    });
    const { data: tasks } = await response.json();

    return tasks;
};

const createTask = async (message) => {
    console.log(JSON.stringify({ message }));

    const response = await fetch(MAIN_URL, {
        method:  'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization:  TOKEN,
        },
        body: JSON.stringify({ message }),
    });

    const { data: task } = await response.json();

    return task;
};

export const api = {
    fetchTasks,
    createTask,
};
