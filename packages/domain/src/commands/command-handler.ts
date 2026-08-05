import type { Command } from "./command";

/**
 * Defines a handler responsible for executing a command.
 *
 * @typeParam TCommand The command type handled by this handler.
 */
export interface CommandHandler<TCommand extends Command> {
    /**
     * Executes the specified command.
     *
     * @param command The command to execute.
     * @returns A promise that resolves when command execution completes.
     */
    handle(command: TCommand): Promise<void>;
}