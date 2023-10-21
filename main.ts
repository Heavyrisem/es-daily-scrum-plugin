import { dailyScrumTemplate, defaultTemplate } from "default.template";
import { App, Editor, Notice, Plugin, PluginManifest, TFile } from "obsidian";
import { isScrum, parseDailyNoteScrum, parseScrum, Scrum } from "scrum.parser";
import { formatDateToYYYYMMDD, getDateString, getMonthString } from "utils";
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
				try {
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
				} catch (err) {
					return;
				}
			},
		});

		this.addCommand({
			id: "copy-scrum",
			name: "copy scrum",
			editorCallback: async (editor, ctx) => {
				try {
					// const input = editor.getDoc().getValue();
					if (!ctx.file) throw Error("현재 열린 노트가 없습니다.");

					const currentFileInfo = await this.getFileInfo(ctx.file);
					const currentScrum = parseDailyNoteScrum({
						...currentFileInfo,
						...ctx.file,
					});

					const prevScrumFile = this.app.vault
						.getMarkdownFiles()
						.filter((file) => {
							return /^\d{4}-\d{2}-\d{2}\.md$/.test(file.name);
						})
						.sort(
							(a, b) =>
								new Date(a.name.replace(".md", "")).getTime() -
								new Date(b.name.replace(".md", "")).getTime()
						)
						.at(0);

					if (!prevScrumFile)
						throw new Error("이전 날짜의 스크럼이 없습니다.");
					const prevScrumFileInfo = await this.getFileInfo(
						prevScrumFile
					);
					const prevScrum = parseDailyNoteScrum({
						...prevScrumFileInfo,
						...prevScrumFile,
					});

					const copyString = dailyScrumTemplate(
						prevScrum,
						currentScrum
					);

					console.log(copyString);
				} catch (err) {
					console.log(err);
				}
			},
		});

		this.app.workspace.on("editor-change", this.checkScrumExist.bind(this));
	}

	onunload() {}

	checkScrumExist(editor: Editor): boolean {
		try {
			if (!editor) return false;
			const input = editor.getDoc().getValue();
			const isValidScrum = isScrum(input);
			this.statusBarItemEl.setText(
				isValidScrum ? "Scrum found" : "No Scrum detected"
			);

			return isValidScrum;
		} catch (err) {
			return false;
		}
	}

	async getFileInfo(file: TFile) {
		const content = await this.app.vault.cachedRead(file);
		if (!content) throw Error("노트가 비었습니다.");
		const fontmatter =
			this.app.metadataCache.getFileCache(file)?.frontmatter;
		if (!fontmatter) throw Error("메타데이터가 없습니다.");

		return { content, fontmatter };
	}
}
