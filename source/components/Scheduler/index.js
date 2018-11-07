// Core
import React, { Component } from 'react';
import Task from 'components/Task';
import Spinner from 'components/Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from '../../theme/assets/Checkbox';
import { sortTasksByGroup } from '../../instruments';

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        this.setState({
            tasks: sortTasksByGroup(await api.fetchTasks()),
        });
        const { tasks } = this.state;

        this.setState({
            initialData: tasks,
        });

        this._setTasksFetchingState(false);
    };

    _createTaskAsync = async (event) => {
        event.preventDefault();
        this._setTasksFetchingState(true);

        if (!this.state.newTaskMessage) {
            return null;
        }
        const task = await api.createTask(this.state.newTaskMessage);

        this.setState({ newTaskMessage: '' });
        this.setState(({ tasks }) => ({
            tasks: [task, ...tasks],
        }));

        this._setTasksFetchingState(false);
    };

    _updateTasksFilter = (event) => {
        this.setState({ tasksFilter: event.target.value.toLowerCase() });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._createTaskAsync();
    };

    _updateTaskAsync = async (taskToUpdate) => {
        this._setTasksFetchingState(true);
        const updatedTask = await api.updateTask(taskToUpdate);

        this.setState(({ tasks }) => ({
            newTaskMessage: '',
            tasks:          sortTasksByGroup(
                tasks.map(
                    (task) =>
                        task.id === updatedTask[0].id ? updatedTask[0] : task
                )
            ),
        }));
        this._setTasksFetchingState(false);
    };
    _getAllCompleted = () => {
        const notCompletedTasks = this.state.tasks.filter(
            (task) => !task.completed
        );

        if (notCompletedTasks.length === 0) {
            return true;
        }

        return false;
    };
    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));
        this._setTasksFetchingState(false);
    };
    _completeAllTasksAsync = async () => {
        const notCompletedTasks = this.state.tasks.filter(
            (task) => !task.completed
        );

        if (notCompletedTasks.length === 0) {
            return null;
        }

        this._setTasksFetchingState(true);
        await api.completeAllTasks(notCompletedTasks);
        const { tasks } = this.state;

        tasks.map((task) => task.completed = true);

        this._setTasksFetchingState(false);
    };

    render () {
        const { isTasksFetching } = this.state;

        const { tasks } = this.state;
        const { tasksFilter } = this.state;

        const filteredTask = tasks.filter((task) => {
            return task.message.toLowerCase().includes(tasksFilter);
        });

        const { newTaskMessage } = this.state;

        const tasksJSX = filteredTask.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { this.state.tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                maxLength = { 50 }
                                placeholder = 'Описание моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay }>
                            <ul>
                                <div style = { { position: 'relative' } }>
                                    {tasksJSX}
                                </div>
                            </ul>
                        </div>
                    </section>
                    <footer className = { Styles.footer }>
                        <Checkbox
                            className = { Styles.toggleTaskCompletedState }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
