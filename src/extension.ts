import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('timestamp-comment.signedTimestamp', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const languageId = document.languageId;
        const commentCharacter = getCommentCharacter(languageId);

        const config = vscode.workspace.getConfiguration('commentExtension');
        const name = config.get('name', 'YourName');
        const displayTimezone = config.get('displayTimezone', false);

        const timestamp = getTimestamp();
        const timezoneOffset = new Date().getTimezoneOffset();
        const timezone = getTimezoneAbbreviation(timezoneOffset);
        const timezoneText = displayTimezone ? ` (${timezone})` : '';
        const commentText = `${commentCharacter} ${name} - ${timestamp}${timezoneText}`;

        editor.edit((editBuilder) => {
          editBuilder.insert(selection.active, commentText);
        });
      }
    });

  function getTimezoneAbbreviation(offset: number): string {
    const hours = Math.abs(offset) / 60;
    const sign = offset >= 0 ? '+' : '-';
    return `GMT${sign}${hours}`;
  }

  context.subscriptions.push(disposable);
}

function getCommentCharacter(languageId: string): string {
	switch (languageId) {
	  case 'javascript':
	  case 'typescript':
		return '//';
	  case 'python':
		return '#';
	  case 'java':
		return '//';
	  case 'c':
	  case 'cpp':
		return '//';
	  case 'csharp':
		return '//';
	  // Add more cases for other languages
	  default:
		return '//';
	}
  }

function getTimestamp(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toLocaleTimeString([], { hour12: false });
  return `${date} ${time}`;
}

export function deactivate() {}
