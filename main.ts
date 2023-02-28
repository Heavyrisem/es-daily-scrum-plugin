import { defaultTemplate } from "default.template";
import { App, Editor, Notice, Plugin, PluginManifest } from "obsidian";
import { isScrum, parseScrum, Scrum } from "scrum.parser";
export default class ScrumPlugin extends Plugin {
	statusBarItemEl: HTMLElement;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);

		this.statusBarItemEl = this.addStatusBarItem();
	}

	async onload() {
		const editor = this.app.workspace.activeEditor?.editor;

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		editor && this.checkScrumExist(editor);

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "write-new-scrum-template",
			name: "write scrum template",
			editorCallback: (editor, ctx) => {
				const input = editor.getDoc().getValue();
				if (!this.checkScrumExist(editor))
					return new Notice("No Valid Scrum found");

				const yesterdayScrum = parseScrum(input);
				const todayScrum: Scrum = {
					...yesterdayScrum,
					date: new Date(),
					yesterday: yesterdayScrum.today,
					today: {
						workType: yesterdayScrum.yesterday.workType,
						data: "",
					},
				};

				editor.getDoc().setValue(defaultTemplate(todayScrum));
			},
		});

		this.app.workspace.on("editor-change", this.checkScrumExist.bind(this));
	}

	onunload() {}

	checkScrumExist(editor: Editor): boolean {
		if (!editor) return false;
		const input = editor.getDoc().getValue();
		const isValidScrum = isScrum(input);
		this.statusBarItemEl.setText(
			isValidScrum ? "Scrum found" : "No Scrum detected"
		);

		return isValidScrum;
	}
}
