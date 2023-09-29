export function createTask (title: string, opts?: Partial<Task>): Task {
    return Object.assign({
        title: title,
        createdAt: Date.now(),
        startAt: null,
        totalTime: 0,
        isRunning: false,

        get id () {
            return this.createdAt;
        }
    }, opts);
}

export function stopTasks (tasks: Task[]) {
    return tasks.map((task) => {
        if (task.isRunning && task.startAt) {
            task.totalTime += Date.now() - task.startAt;
        }

        task.isRunning = false;

        return task;
    });
}

export function getClassName (classList: string[]): string {
    return (
        classList
            .filter((val) => val.trim().length > 1)
            .join(" ")
            .trim()
    );
}

export function getTimeSpent (time: number): string {
    const timeSeconds = time / 1000 || 0;
    const timeHours = Math.floor(timeSeconds / 60 / 60);
    const timeMinutes = Math.abs(timeHours * 60 - (Math.floor(timeSeconds / 60)));

    const timeHoursStr = timeHours ? timeHours + "h" : "";
    const timeMinutesStr = timeHours > 0
        ? timeMinutes.toString().padStart(2, '0') + "m"
        : timeMinutes + "m"

    const timeString = timeHoursStr + timeMinutesStr;

    return timeString;
}

function sortByOldest (dateA: string, dateB: string) {
    return ((new Date(dateA)).getTime() - (new Date(dateB)).getTime());
}

function sortByNewest (dateA: string, dateB: string) {
    return ((new Date(dateB)).getTime() - (new Date(dateA)).getTime());
}

export function getDatesSortedByOldest (tasks: Task[]) {
    const dates = new Set(tasks.map((task) => (new Date(task.createdAt)).toDateString()));

    return Array.from(dates).toSorted(sortByOldest);
}

export function getDatesSortedByNewest (tasks: Task[]) {
    const dates = new Set(tasks.map((task) => (new Date(task.createdAt)).toDateString()));

    return Array.from(dates).toSorted(sortByNewest);
}

export function findPrevTaskId (tasks: Task[], currentTaskId: number): number {
    return tasks
        .toSorted((a, b) => b.id - a.id)
        .find((task) => task.id < currentTaskId)?.id || tasks[0].id;
}

export function findNextTaskId (tasks: Task[], currentTaskId: number): number {
    return tasks.find((task) => task.id > currentTaskId)?.id || tasks[tasks.length - 1].id
}
