import { useEffect, useRef, KeyboardEvent } from 'react';
import { getTimeSpent, getClassName } from '../utils';
import TaskAnimation from './TaskAnimation';

import './Task.scss'

type TaskProps = {
    id: number;
    task: Task;
    isFocused: boolean;
    isEditable: boolean;
    onUpdate: (task: Task, id: number) => unknown;
}

function Task (props: TaskProps) {
    const { id, task, isFocused, isEditable, onUpdate } = props;
    const taskEl = useRef<HTMLDivElement>(null);
    const inputEl = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (taskEl.current && isFocused && !isEditable) {
            taskEl.current.focus();
        } else if (inputEl.current && isFocused && isEditable) {
            inputEl.current.focus();
            inputEl.current.setSelectionRange(0, inputEl.current.value.length);
        }
    }, [isFocused, isEditable]);

    const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter" && inputEl.current && inputEl.current.value.length > 0) {
            onUpdate({ ...task, title: inputEl.current.value }, id)
        }
    }

    const renderTask = () => {
        if (isEditable) {
            return (
                <input
                    ref={inputEl}
                    type="text"
                    defaultValue={task.title}
                    onKeyDown={onKeyDown}
                />
            )
        }

        if (task.isRunning) {
            return (
                <>
                    <span>{task.title}</span>
                    <span><TaskAnimation /></span>
                </>
            );
        }

        return (
            <>
                <span>{task.title}</span>
                <span>{getTimeSpent(task.totalTime)}</span>
            </>
        );
    };

    const className = getClassName([
        "task",
        (isFocused ? "task--is-focused" : ""),
        (isEditable ? "task--is-editable" : ""),
        (task.isRunning ? "task--is-running" : ""),
    ]);

    return (
        <div
            ref={taskEl}
            className={className}
            tabIndex={-1}
        >
            {renderTask()}
        </div>
    )
}

export default Task;
