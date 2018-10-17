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
        tasks:           [
            { id: 1, completed: '', favorit: '', message: 'message' },
            { id: 2, message: 'message2' }
        ],
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
                <ul>
                    <div>{tasksJSX}</div>
                </ul>
            </section>
        );
    }
}
