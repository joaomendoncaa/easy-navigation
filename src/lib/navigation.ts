import * as vscode from "vscode";
import { spawn } from "child_process";
import { Readable } from "stream";

const ignore: string[] = ["node_modules", ".git"];

export function openEasyNavigation(): void {
    const quickPick = vscode.window.createQuickPick();

    quickPick.placeholder = "Search for anything inside the codebase..";

    quickPick.onDidChangeValue(async (value) => {
        if (!value || value.length === 0) quickPick.items = [];

        const files = await fuzzyFindFiles(value, {
            ignore: getIgnoreFlags(),
        });

        let items: vscode.QuickPickItem[] = [];

        items.push({
            label: "Files",
            kind: vscode.QuickPickItemKind.Separator,
        });

        for (let i = 0; i < files.length; i++) {
            const filePath = files[i];

            items.push({
                label: `${filePath}`,
                detail: "DETAIL HERE",
                description: "lorem ipsum",
            });
        }

        items.push({
            label: "Content",
            kind: vscode.QuickPickItemKind.Separator,
        });

        quickPick.items = items;
    });

    quickPick.onDidChangeSelection((selection) => {
        if (!selection[0]) return;

        vscode.window.showInformationMessage(`Selection picked:\n${selection[0].label}`);
        quickPick.hide();
    });

    quickPick.show();
}

async function fuzzyFindFiles(match: string, options?: { ignore?: string[] }): Promise<string[]> {
    const ignoreFlags = options?.ignore ? options.ignore : [];
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    if (!workspaceFolder) return [];

    process.chdir(workspaceFolder);

    const grep = spawn("grep", ["-irl", match, process.cwd(), ...ignoreFlags]);
    const files: string[] = [];

    for await (const data of grep.stdout as Readable) {
        const lines = data
            .toString()
            .split("\n")
            .map((line: string) => line.trim().replace(workspaceFolder, ""));

        for (const line of lines) {
            if (line !== "") {
                files.push(line);
            }
        }
    }

    return files;
}

function getIgnoreFlags(): string[] {
    if (!vscode.window.activeTextEditor?.document.uri) return [];

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(
        vscode.window.activeTextEditor?.document.uri
    );

    if (!workspaceFolder) return [];

    const rootPath = workspaceFolder.uri.fsPath;
    const ignoreFlags: string[] = [];

    ignore.forEach((pattern) => {
        ignoreFlags.push(`--exclude-dir=${pattern}`);
    });

    return ignoreFlags;
}
