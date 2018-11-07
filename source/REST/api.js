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

const removeTask = async (id) => {
    await fetch(`${MAIN_URL}/${id}`, {
        method:  'DELETE',
        headers: {
            Authorization: TOKEN,
        },
    });
};

const updateTask = async (updatedTask) => {
    const arr = [];

    arr.push(updatedTask);
    const response = await fetch(`${MAIN_URL}`, {
        method:  'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization:  TOKEN,
        },
        body: JSON.stringify(arr),
    });

    const { data: task } = await response.json();

    return task;
};

const completeAllTasks = async (tasks) => {
    tasks.map((task) => task.completed = true);

    const requests = tasks.map((task) =>
        fetch(`${MAIN_URL}`, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([task]),
        })
    );

    const { data: error } = await Promise.all(requests);

    return error;
};

export const api = {
    fetchTasks,
    createTask,
    removeTask,
    updateTask,
    completeAllTasks,
};
