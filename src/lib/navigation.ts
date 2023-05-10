import * as vscode from "vscode";

export function openEasyNavigation(): void {
    const items = ["opt 1", "opt 2", "opt 3"];
    const quickPick = vscode.window.createQuickPick();

    quickPick.items = items.map((opt) => ({ label: opt }));
    quickPick.onDidChangeSelection((selection) => {
        if (!selection[0]) return;

        vscode.window.showInformationMessage(`Selection picked:\n${selection[0].label}`);
    });

    quickPick.show();
}
