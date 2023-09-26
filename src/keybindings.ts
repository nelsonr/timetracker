export const keybindings = {
    move_down: ["j", "ArrowDown"],
    move_up: ["k", "ArrowUp"],
    add_task: ["a", "Enter"],
    toggle_task: [" "], // Space key
    edit_task: ["e", "i"],
    close_edit_task: ["Escape"],
    delete_task: ["d", "Delete"],
};

export const keys = {
    isMoveDown: Array.prototype.includes.bind(keybindings.move_down),
    isMoveUp: Array.prototype.includes.bind(keybindings.move_up),
    isEditTask: Array.prototype.includes.bind(keybindings.edit_task),
    isCloseEditTask: Array.prototype.includes.bind(keybindings.close_edit_task),
    isAddTask: Array.prototype.includes.bind(keybindings.add_task),
    isDeleteTask: Array.prototype.includes.bind(keybindings.delete_task),
    isToggleTask: Array.prototype.includes.bind(keybindings.toggle_task),
};
