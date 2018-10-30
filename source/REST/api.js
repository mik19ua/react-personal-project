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

const removeTask = async (id) => {
    await fetch(`${MAIN_URL}/${id}`, {
        method:  'DELETE',
        headers: {
            Authorization: TOKEN,
        },
    });
};

const updateTask = async (updatedTask) => {
    console.log(updatedTask);
    const response = await fetch(`${MAIN_URL}`, {
        method:  'PUT',
        headers: {
            Authorization: TOKEN,
        },
        body: JSON.stringify({ updatedTask }),
    });

    const { data: task } = await response.json();

    return task;
};

const completeAllTasks = async (tasks) => {
    const requests = tasks.map((task) =>
        fetch(`${MAIN_URL}`, {
            method:  'PUT',
            headers: {
                Authorization: TOKEN,
            },
            body: JSON.stringify({ task }),
        })
    );

    const { data: tasksCompl } = await Promise.all(requests);

    return tasksCompl;
};

export const api = {
    fetchTasks,
    createTask,
    removeTask,
    updateTask,
    completeAllTasks,
};
