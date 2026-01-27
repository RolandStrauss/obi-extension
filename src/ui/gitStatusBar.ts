import * as vscode from 'vscode';
import { findGit } from '../platform/gitDetection';

export function registerGitStatusBar(ctx: vscode.ExtensionContext) {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  item.name = 'Lancelot Git Status';
  item.command = 'ldm.tools.checkGit'; // click opens your existing check flow
  ctx.subscriptions.push(item);

  const update = async () => {
    const cfg = vscode.workspace.getConfiguration();
    const showWhenAvailable = cfg.get<boolean>('ldm.gitStatus.showWhenAvailable', true);
    const guideUrl = (cfg.get<string>('ldm.docs.gitInstallUrl') || '').trim();

    const gitPath = await findGit();
    if (gitPath) {
      const md = new vscode.MarkdownString();
      md.isTrusted = true;
      md.supportHtml = false;
      md.appendText(`Git detected (${gitPath}).\n\n`);
      if (showWhenAvailable) {
        md.appendMarkdown(
          guideUrl
            ? `[$(link-external) Open "Install Git via Software Center" guide](${guideUrl})`
            : `[$(link-external) Open Git downloads](${vscode.Uri.parse('https://git-scm.com/downloads')})`
        );
      }
      item.text = '$(check) Git';
      item.tooltip = md;
      if (showWhenAvailable) {
        item.show();
      } else {
        item.hide();
      }
    } else {
      const md = new vscode.MarkdownString();
      md.isTrusted = true;
      md.supportHtml = false;
      md.appendMarkdown('**Git is missing.** Lancelot requires Git for repository operations.\n\n');

      // Primary: internal Software Center guide (preferred, policy-aligned)
      if (guideUrl) {
        md.appendMarkdown(
          `[$(book) Open "Install Git via Software Center" guide](${guideUrl})\n\n`
        );
      }

      // Secondary: handy helpers (user-consented)
      md.appendMarkdown(
        `**Other options**\n\n- [$(link-external) Git downloads](https://git-scm.com/downloads)\n`
      );

      item.text = '$(warning) Git missing';
      item.tooltip = md;
      item.show();
    }
  };

  // React to settings changes and window focus
  ctx.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (
        e.affectsConfiguration('git.path') ||
        e.affectsConfiguration('ldm.gitStatus.showWhenAvailable') ||
        e.affectsConfiguration('ldm.gitStatus.refreshOnWindowFocus') ||
        e.affectsConfiguration('ldm.docs.gitInstallUrl')
      ) {
        void update();
      }
    }),
    vscode.window.onDidChangeWindowState(state => {
      const refreshOnFocus = vscode.workspace
        .getConfiguration('ldm.gitStatus')
        .get<boolean>('refreshOnWindowFocus', true);
      if (refreshOnFocus && state.focused) {
        void update();
      }
    })
  );

  void update();
  return { update };
}
