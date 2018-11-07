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

    _taskInputFocus = () => {
        this.taskInput.current.focus();
    };

    _setTaskEditingState = (state) => {
        this.setState({
            isTaskEditing: state,
        });
        if (state) {
            this._taskInputFocus();
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

        if (this.state.newMessage === '') {
            return null;
        }

        if (enterKey) {
            this._updateTask();
        }

        if (escapeKey) {
            this._cancelUpdatingTaskMessage();
        }
    };

    _updateTask = () => {
        this._setTaskEditingState(false);
        if (this.state.newMessage !== this.props.message) {
            const task = this._getTaskShape(this.props);

            task.message = this.state.newMessage;

            this.props._updateTaskAsync(task);
        } else {
            return null;
        }
    };

    _updateTaskMessageOnClick = () => {
        if (this.state.isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(!this.state.isTaskEditing);
    };
    _cancelUpdatingTaskMessage = () => {
        this.setState({
            newMessage:    this.props.message,
            isTaskEditing: false,
        });
    };
    _toggleTaskCompletedState = () => {
        const completed = {
            completed: !this.props.completed,
        };
        const task = this._getTaskShape(completed);

        this.props._updateTaskAsync(task);
    };
    _toggleTaskFavoriteState = () => {
        const favorite = {
            favorite: !this.props.favorite,
        };
        const task = this._getTaskShape(favorite);

        this.props._updateTaskAsync(task);
    };

    _removeTask = () => {
        this.props._removeTaskAsync(this.props.id);
    };

    render () {
        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { this.props.completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#363636'
                        color2 = '#fff'
                        onClick = { this._toggleTaskCompletedState }
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
                        checked = { this.props.favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#f00'
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#f00'
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#f00'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
