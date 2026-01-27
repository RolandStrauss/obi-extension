
// src/platform/gitInstallPrompt.ts
import * as vscode from 'vscode';
import { spawn } from 'node:child_process';
import * as os from 'node:os';

export async function handleMissingGit(): Promise<void> {
  const buttons: string[] = [];

  // Primary (corporate‑managed): Software Center / Company Portal
  if (process.platform === 'win32') {
    buttons.push('Open Software Center');
  }

  // Optional helpers (user‑consented, non‑managed scenarios)
  if (process.platform === 'win32') {
    buttons.push('Install via winget (silent)');
  } else if (process.platform === 'darwin') {
    buttons.push('Show Homebrew command');
  } else if (process.platform === 'linux') {
    buttons.push('Show package manager command');
  }

  buttons.push('Open Git downloads page');

  const choice = await vscode.window.showErrorMessage(
    'Git was not found on this machine. Lancelot requires Git for repository operations.',
    { modal: false, detail: 'Choose how you want to install or configure Git.' },
    ...buttons
  );

  switch (choice) {
    case 'Open Software Center':
      // SCCM Software Center (interactive) – recommended corporate path
      // We avoid silent installs; user completes the sanctioned workflow.
      try {
        // These launchers vary by tenant; try URI first, then EXE path.
        // If it fails, show a message with manual steps.
        const opened = await vscode.env.openExternal(vscode.Uri.parse('softwarecenter:'));
        if (!opened) {
          await vscode.window.showInformationMessage(
            'Open the Windows Start menu and search for "Software Center", then install **Git** from the Catalog.'
          );
        }
      } catch {
        await vscode.window.showInformationMessage(
          'Open the Windows Start menu and search for "Software Center", then install **Git** from the Catalog.'
        );
      }
      break;

    case 'Install via winget (silent)':
      // Only run on explicit consent. May require admin or be blocked by policy.
      await runTerminalCommand('winget install --id Git.Git -e --silent');
      break;

    case 'Show Homebrew command':
      await showCommand('brew install git');
      break;

    case 'Show package manager command':
      // We can’t know the distro; offer common options.
      await showCommand([
        'sudo apt-get update && sudo apt-get install -y git',
        'sudo dnf install -y git',
        'sudo yum install -y git',
        'sudo pacman -S --noconfirm git'
      ].join(os.EOL));
      break;

    case 'Open Git downloads page':
      vscode.env.openExternal(vscode.Uri.parse('https://git-scm.com/downloads'));
      break;

    default:
      // do nothing
      break;
  }
}

async function runTerminalCommand(cmd: string) {
  const term = vscode.window.createTerminal({ name: 'Install Git' });
  term.show();
  term.sendText(cmd, true);
  vscode.window.showInformationMessage('A terminal has been opened with the install command. Complete any prompts and then reload VS Code.');
}

async function showCommand(cmd: string) {
  const picked = await vscode.window.showInformationMessage(
    'Run this in your terminal to install Git:',
    { modal: false, detail: cmd },
    'Copy'
  );
  if (picked === 'Copy') {
    await vscode.env.clipboard.writeText(cmd);
    vscode.window.showInformationMessage('Command copied to clipboard.');
  }
}
