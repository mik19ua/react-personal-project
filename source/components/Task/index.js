// Core
import React, { PureComponent } from 'react';
import Checkbox from '../../theme/assets/Checkbox';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';
import Remove from '../../theme/assets/Remove';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    state = {
        isTaskEditing:  false,
        newTaskMessage: '',
        newMessage:     this.props.message,
        current:        this.props.id,
    };
    taskInput = React.createRef();
    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = () => {
        if (!this.state.isTaskEditing) {
            this.setState({
                isTaskEditing: true,
            });
            setTimeout(() => {
                this.taskInput.current.focus();
            }, 300);
        } else {
            this._updateTaskMessageOnClick();
        }
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        });
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const enterKey = event.key === 'Enter';
        const escapeKey = event.key === 'Escape';

        if (enterKey) {
            this._updateTaskMessageOnClick();
        }

        if (escapeKey) {
            this._cancelUpdatingTaskMessage();
        }
    };

    _updateTask = () => {
        const task = this._getTaskShape(this.props);

        task.message = this.state.newMessage;

        this.props._updateTaskAsync(task);
    };

    _updateTaskMessageOnClick = () => {
        console.log('_updateTaskMessageOnClick called');
        if (this.props.message === this.state.newMessage) {
            this._cancelUpdatingTaskMessage();
        } else {
            this._updateTask();
            this.setState({
                isTaskEditing: false,
            });
        }
    };
    _cancelUpdatingTaskMessage = () => {
        this.setState({
            newMessage:    this.props.message,
            isTaskEditing: false,
        });
    };
    _toggleTaskCompletedState = () => {};
    _toggleTaskFavoriteState = () => {};
    _taskInputFocus = () => {
        setTimeout(() => {
            this.taskInput.current.focus();
        }, 300);
    };

    _removeTask = async (event) => {
        event.preventDefault;

        await this.props._removeTaskAsync(this.props.id);
    };

    render () {
        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { false }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#363636'
                        color2 = '#fff'
                    />
                    <input
                        disabled = { !this.state.isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { this.state.newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        className = { Styles.toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        className = { Styles.updateTaskMessageOnClick }
                        onClick = { this._setTaskEditingState }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
