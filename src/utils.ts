export function createTask (title: string, opts?: Partial<Task>): Task {
    return Object.assign({
        title: title,
        createdAt: (new Date()).toUTCString(),
        startAt: null,
        endAt: null,
        totalTime: 0,
        isRunning: false
    }, opts);
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
