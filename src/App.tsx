import { useState, KeyboardEvent, useEffect, useRef } from 'react';

import FeedbackMessage from './components/FeedbackMessage';
import useLocalStorage from './components/LocalStorage';
import Task from './components/Task'
import { keys } from "./keybindings";
import { createTask, getTimeSpent } from './utils';

import './App.scss'
import HelpPopup from './HelpPopup';

function App () {
    const [feedbackMessage, setFeedbackMessage] = useState({ message: "", show: false });
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [showHelpPopup, setShowHelpPopup] = useState(false);
    const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", () => {
        return [
            createTask("New task"),
        ]
    });

    const timerRef = useRef(0);

    useEffect(() => {
        if (feedbackMessage.show) {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() =>
                setFeedbackMessage({ ...feedbackMessage, show: false }),
                5000
            );
        }
    }, [feedbackMessage]);

    function onKeyDown (ev: KeyboardEvent) {
        if (!isEditing && !showHelpPopup) {
            switch (true) {
                case ev.key === "?":
                    setShowHelpPopup(true);
                    break;

                case keys.isMoveDown(ev.key) && currentTaskIndex < (tasks.length - 1):
                    setCurrentTaskIndex(currentTaskIndex + 1);
                    break;

                case keys.isMoveUp(ev.key) && currentTaskIndex > 0:
                    setCurrentTaskIndex(currentTaskIndex - 1);
                    break;

                case keys.isEditTask(ev.key):
                    setIsEditing(true);
                    ev.preventDefault();
                    break;

                case keys.isAddTask(ev.key):
                    addTask(createTask("New task"));
                    break;

                case keys.isDeleteTask(ev.key):
                    handleTaskRemove();
                    break;

                case keys.isToggleTask(ev.key):
                    toggleTask()
                    break;

                default:
                    break;
            }
        } else if (showHelpPopup) {
            if (ev.key === "Escape") {
                setShowHelpPopup(false);
            }
        } else {
            if (keys.isCloseEditTask(ev.key)) {
                setIsEditing(false);
            }
        }
    }

    function handleTaskRemove () {
        if (tasks[currentTaskIndex].isRunning) {
            setFeedbackMessage({
                message: "Cannot delete a running task.",
                show: true
            });

            return false;
        }

        if (tasks[currentTaskIndex].totalTime > 0) {
            setFeedbackMessage({
                message: "Cannot delete a task with time tracked.",
                show: true
            });

            return false;
        }

        removeTask();
    }

    function addTask (task: Task) {
        setTasks([...tasks, task]);
    }

    function removeTask () {
        const updatedTasks = tasks.filter((_task, index) => {
            return index !== currentTaskIndex;
        });

        setTasks(updatedTasks);

        if (updatedTasks.length === currentTaskIndex) {
            setCurrentTaskIndex(currentTaskIndex - 1)
        }
    }

    function updateTask (updatedTask: Task, id: number) {
        const updatedTasks = tasks.map((task, index) => {
            if (index === id) {
                return updatedTask;
            }

            return task;
        });

        setTasks(updatedTasks);
        setIsEditing(false);
    }

    function toggleTask () {
        const updatedTasks = tasks.map((task, index) => {
            if (index === currentTaskIndex) {
                if (!task.isRunning) {
                    task.startAt = Date.now();
                    task.isRunning = true;
                } else {
                    if (task.startAt) {
                        task.totalTime += Date.now() - task.startAt;
                    }

                    task.isRunning = false;
                }
            } else {
                if (task.isRunning && task.startAt) {
                    task.totalTime += Date.now() - task.startAt;
                }

                task.isRunning = false;
            }

            return task;
        });

        setTasks(updatedTasks);
    }

    const dates = new Set(tasks.map((task) => (new Date(task.createdAt)).toDateString()));
    let counter = 0;

    // TODO: make this work with the currentTaskIndex
    // const sortByMostRecent = (dateA: string, dateB: string) => {
    //     return (new Date(dateB)).getTime() - (new Date(dateA)).getTime();
    // };

    const tasksGroupedByDate = Array.from(dates).map((dateString, dateIndex) => {
        const tasksByDate = tasks.filter((task) =>
            (new Date(task.createdAt)).toDateString() === dateString
        );

        const totalTimeByDate = tasksByDate.reduce((sum, task: Task) => sum + task.totalTime, 0);

        const tasksList = tasksByDate.map((task) => {
            const li = (
                <li key={counter}>
                    <Task
                        key={counter}
                        id={counter}
                        task={task}
                        isFocused={currentTaskIndex === counter}
                        isEditable={isEditing && currentTaskIndex === counter}
                        onUpdate={updateTask}
                    />
                </li>
            );

            counter += 1;

            return li;
        });

        return (
            <section key={dateIndex}>
                <h3>{dateString} &mdash; <span>{getTimeSpent(totalTimeByDate)}</span></h3>
                <ul>
                    {tasksList}
                </ul>
            </section>
        )
    });

    return (
        <main tabIndex={-1} onKeyDown={onKeyDown}>
            <FeedbackMessage message={feedbackMessage.message} show={feedbackMessage.show} />

            <HelpPopup showPopup={showHelpPopup} onToggle={(setShowHelpPopup)} />

            <div className="tasks">{tasksGroupedByDate}</div>
        </main>
    )
}

export default App;
