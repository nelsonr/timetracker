import { useState, KeyboardEvent, useEffect, useRef } from 'react';

import FeedbackMessage from './components/FeedbackMessage';
import useLocalStorage from './components/LocalStorage';
import Task from './components/Task'
import { keys } from "./keybindings";
import { createTask, findNextTaskId, findPrevTaskId, getTimeSpent, getDatesSortedByOldest, stopTasks } from './utils';

import './App.scss'
import HelpPopup from './HelpPopup';

const ONE_MINUTE = 60000;

function App () {
    const [feedbackMessage, setFeedbackMessage] = useState({ message: "", show: false });
    const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showHelpPopup, setShowHelpPopup] = useState(false);
    const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", () => {
        return [
            createTask("New Task")
        ];
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

        if (!currentTaskId && tasks.length > 0) {
            setCurrentTaskId(tasks[tasks.length - 1].id);
        }

        if (tasks.length === 0) {
            setTasks([createTask("New Task")]);
        }

        const onBeforeUnload = () => setTasks(stopTasks(tasks));

        window.addEventListener("beforeunload", onBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, [feedbackMessage, currentTaskId, tasks, setTasks]);

    function onKeyDown (ev: KeyboardEvent) {
        if (!isEditing && !showHelpPopup) {
            switch (true) {
                case keys.isShowHelp(ev.key):
                    setShowHelpPopup(true);
                    break;

                case keys.isMoveDown(ev.key) && currentTaskId !== null:
                    ev.preventDefault();
                    setCurrentTaskId(findNextTaskId(tasks, currentTaskId as number));
                    break;

                case keys.isMoveUp(ev.key) && currentTaskId !== null:
                    ev.preventDefault();
                    setCurrentTaskId(findPrevTaskId(tasks, currentTaskId as number));
                    break;

                case keys.isEditTask(ev.key):
                    ev.preventDefault();
                    setIsEditing(true);
                    break;

                case keys.isAddTask(ev.key):
                    addTask(createTask("New task"));
                    break;

                case keys.isDeleteTask(ev.key):
                    onRemoveTask();
                    break;

                case keys.isToggleTask(ev.key):
                    toggleTask()
                    break;

                default:
                    break;
            }
        } else if (showHelpPopup) {
            if (keys.isCloseHelp(ev.key)) {
                setShowHelpPopup(false);
            }
        } else {
            if (keys.isCloseEditTask(ev.key)) {
                setIsEditing(false);
            }
        }
    }

    function onRemoveTask () {
        const currentTask = tasks.find((task) => task.id === currentTaskId);

        if (currentTask && currentTask.isRunning) {
            setFeedbackMessage({
                message: "Cannot delete a running task.",
                show: true
            });

            return false;
        }

        if (currentTask && currentTask.totalTime > ONE_MINUTE) {
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
        setCurrentTaskId(task.id)
    }

    function removeTask () {
        const updatedTasks = tasks.filter((task) => {
            return task.id !== currentTaskId;
        });

        setTasks(updatedTasks);

        if (currentTaskId) {
            if (updatedTasks.length > 0) {
                setCurrentTaskId(findNextTaskId(updatedTasks, currentTaskId));
            } else {
                setCurrentTaskId(null);
            }
        }
    }

    function updateTask (updatedTask: Task, id: number) {
        const updatedTasks = tasks.map((task) => {
            if (task.id === id) {
                return updatedTask;
            }

            return task;
        });

        setTasks(updatedTasks);
        setIsEditing(false);
    }

    function toggleTask () {
        const updatedTasks = tasks.map((task) => {
            if (currentTaskId === task.id) {
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

    const tasksGroupedByDate = getDatesSortedByOldest(tasks).map((dateString) => {
        const tasksByDate = tasks.filter((task) =>
            (new Date(task.createdAt)).toDateString() === dateString
        );

        const totalTimeByDate = tasksByDate.reduce((sum, task: Task) => sum + task.totalTime, 0);

        const tasksList = tasksByDate.map((task) => {
            const li = (
                <li key={task.id}>
                    <Task
                        id={task.id}
                        task={task}
                        isFocused={currentTaskId === task.id}
                        isEditable={isEditing && currentTaskId === task.id}
                        onUpdate={updateTask}
                    />
                </li>
            );

            return li;
        });

        return (
            <section key={dateString}>
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
