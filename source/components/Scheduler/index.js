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

    _createTaskAsync = async (newTaskMessage) => {
        this._setTasksFetchingState(true);
        const task = await api.createTask(newTaskMessage);

        this.setState({
            newTaskMessage:  '',
            isTasksFetching: false,
            tasks:           [task, ...this.tasks],
        });
    };

    render () {
        const { isTasksFetching } = this.state;
        const { tasks } = this.state;

        const tasksJSX = tasks.map((task) => {
            return <Task key = { task.id } { ...task } />;
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'text' />
                    </header>
                    <section>
                        <form>
                            <input
                                maxLength = '50'
                                placeholder = 'Описание моей новой задачи'
                                type = 'text'
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>{tasksJSX}</ul>
                        </div>
                    </section>
                </main>
            </section>
        );
    }
}
