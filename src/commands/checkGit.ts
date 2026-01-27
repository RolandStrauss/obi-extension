// src/commands/checkGit.ts
import * as vscode from 'vscode';
import { findGit } from '../platform/gitDetection';
import { handleMissingGit } from '../platform/gitInstallPrompt';

export function registerCheckGitCommand(ctx: vscode.ExtensionContext) {
  // Toggle Git status bar visibility
  const toggleVisibility = vscode.commands.registerCommand('ldm.gitStatus.toggleVisibility', async () => {
    const config = vscode.workspace.getConfiguration();
    const current = config.get<boolean>('ldm.gitStatus.showWhenAvailable', true);
    await config.update('ldm.gitStatus.showWhenAvailable', !current, false);
    vscode.window.showInformationMessage(
      `Git status bar ${!current ? 'shown' : 'hidden'}.`
    );
  });
  ctx.subscriptions.push(toggleVisibility);

  // Check Git availability
  const d = vscode.commands.registerCommand('ldm.tools.checkGit', async () => {
    try {
      const gitPath = await findGit();

      if (gitPath) {
        const choice = await vscode.window.showInformationMessage(
          `Git is available (${gitPath}).`,
          'Copy Path',
          'Open Settings…'
        );
        if (choice === 'Copy Path') {
          await vscode.env.clipboard.writeText(gitPath);
          vscode.window.showInformationMessage('Copied Git path to clipboard.');
        } else if (choice === 'Open Settings…') {
          await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:Git git.path');
        }
      } else {
        // Git not found - offer guide link and remediation options
        const guideUrl = (vscode.workspace.getConfiguration().get<string>('ldm.docs.gitInstallUrl') || '').trim();
        const buttons = [
          ...(guideUrl ? ['Open Install Guide'] as const : []),
          'Fix it now',
          "Don't ask again"
        ];

        const choice = await vscode.window.showWarningMessage(
          'Git is required for Lancelot workflows, but it was not found.',
          ...buttons
        );

        if (choice === 'Open Install Guide' && guideUrl) {
          await vscode.env.openExternal(vscode.Uri.parse(guideUrl));
        } else if (choice === 'Fix it now') {
          await handleMissingGit();
        } else if (choice === "Don't ask again") {
          // Optionally suppress future warnings (can be stored in context state)
          vscode.window.showInformationMessage('You can re-enable Git checks anytime via the command palette.');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      vscode.window.showErrorMessage(`Git check failed: ${msg}`);
    }
  });

  ctx.subscriptions.push(d);
}
