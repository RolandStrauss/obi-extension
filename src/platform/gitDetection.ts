// src/platform/gitDetection.ts
import * as vscode from 'vscode';
import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import { constants as fsConst } from 'node:fs';
import { join } from 'node:path';
import { once } from 'node:events';
import * as os from 'node:os';

export async function findGit(): Promise<string | undefined> {
  // 1) Respect VS Code's git.path setting if present
  const gitConfigPath = vscode.workspace.getConfiguration('git').get<string>('path');
  if (gitConfigPath && await isExecutable(gitConfigPath)) {
    return gitConfigPath;
  }

  // 2) Ask PATH: `git --version`
  const version = await trySpawn('git', ['--version']);
  if (version?.code === 0) {
    return 'git'; // available on PATH
  }

  // 3) Platform fallbacks
  if (process.platform === 'win32') {
    // Common Git locations on Windows (non-exhaustive)
    const candidates = [
      process.env['ProgramFiles'] && join(process.env['ProgramFiles']!, 'Git', 'cmd', 'git.exe'),
      process.env['ProgramFiles(x86)'] && join(process.env['ProgramFiles(x86)']!, 'Git', 'cmd', 'git.exe'),
      'C:\\Program Files\\Git\\cmd\\git.exe',
      'C:\\Program Files (x86)\\Git\\cmd\\git.exe'
    ].filter(Boolean) as string[];

    for (const c of candidates) {
      if (await isExecutable(c)) {
        return c;
      }
    }
    // last try: `where git`
    const whereRes = await trySpawn('where', ['git']);
    if (whereRes?.code === 0 && whereRes.stdout?.trim()) {
      return 'git';
    }
  } else {
    // macOS/Linux: try `which git`
    const whichRes = await trySpawn('which', ['git']);
    if (whichRes?.code === 0 && whichRes.stdout?.trim()) {
      return 'git';
    }
    // Xcode CLI (macOS) may prompt a dialog if missing; we avoid triggering it here.
  }

  return undefined;
}

async function isExecutable(path: string) {
  try {
    await access(path, fsConst.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function trySpawn(cmd: string, args: string[]) {
  try {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    const [code] = await once(child, 'close') as [number, unknown];
    const stdout = await streamToString(child.stdout);
    const stderr = await streamToString(child.stderr);
    return { code, stdout, stderr };
  } catch {
    return undefined;
  }
}

function streamToString(stream: NodeJS.ReadableStream | null): Promise<string> {
  if (!stream) {
    return Promise.resolve('');
  }
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    stream.on('data', (d) => chunks.push(Buffer.from(d)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', () => resolve(''));
  });
}
