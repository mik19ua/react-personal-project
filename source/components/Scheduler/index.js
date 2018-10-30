// Core
import React, { Component } from 'react';
import Task from 'components/Task';
import Spinner from 'components/Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

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
            tasks:           await api.fetchTasks(),
            isTasksFetching: false,
        });
    };

    _createTaskAsync = async (event) => {
        event.preventDefault();
        this._setTasksFetchingState(true);
        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }
        const task = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            newTaskMessage:  '',
            isTasksFetching: false,
            tasks:           [task, ...tasks],
        }));
    };

    _updateTasksFilter = (event) => {
        this.setState({ tasksFilter: event.target.value });
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

    _updateTaskAsync = async (task) => {
        const updatedTask = await api.updateTask(task);

        this.setState(({ tasks }) => ({
            newTaskMessage:  '',
            isTasksFetching: false,
            tasks:           [updatedTask, ...tasks],
        }));
    };

    render () {
        const { isTasksFetching } = this.state;
        const { tasks } = this.state;
        const { newTaskMessage } = this.state;

        const tasksJSX = tasks.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
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
                        <form>
                            <input
                                maxLength = '50'
                                placeholder = 'Описание моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button onClick = { this._createTaskAsync }>
                                Добавить задачу
                            </button>
                        </form>
                        <div className = { Styles.overlay }>
                            <ul>
                                <div style = { { position: 'relative' } }>
                                    {tasksJSX}
                                </div>
                            </ul>
                        </div>
                    </section>
                </main>
            </section>
        );
    }
}
