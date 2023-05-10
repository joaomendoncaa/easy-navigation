import * as vscode from "vscode";
import { openEasyNavigation } from "./lib/navigation";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "extension.openEasyNavigation",
        openEasyNavigation
    );

    context.subscriptions.push(disposable);
}
