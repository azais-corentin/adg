---
title: Saving and exporting
stage: pre-infinity
order: 2
summary: Copy or export your save from the Android app, and which of the two formats to pick.
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Where the save options are

Everything to do with saves is in the **Options** tab (the sliders icon, always third from the right in the tab bar), in the **Save & Load** section below the display settings.

<Screen
	src="early-eternity/options-save-load.webp"
	alt="The Options tab: a grid of UI settings, then the Save & Load section with Share save, Select save, Load backup, Export to mobile, Export to web/steam, Import save, the cloud save buttons and Reset current save."
	caption="Options on Android 3.18.0. Save & Load starts with the Share save button."
/>

## Copy your save (quickest)

1. Open **Options** and scroll to **Save & Load**.
2. Tap **Export to web/steam**. The game shows "Exported to clipboard": the whole save is now on your clipboard as text.
3. Switch to your browser, open [Save import](/import), long-press the **Paste the save text** box, choose **Paste**, and tap **Read pasted save**.

**Export to mobile** works the same way, in the app's own format (see below).

## Export your save to a file

Use a file if pasting fails, for example when the save went through a chat or notes app that cut the long text short.

1. Open **Options** and scroll to **Save & Load**.
2. Touch and hold **Share save (hold for save to file)**. A dialog offers **Export to mobile** and **Export to web/steam**.
3. Tap **Export to web/steam**. Android's file picker opens in Downloads, with a name like `ADWebSave_<date and time>.txt`. Save it there or anywhere else.
4. When you come back to the game, a **"While you were away for N seconds"** popup appears, even if you were gone for a few seconds. Tap **Confirm** to close it.

<Screen
	src="early-eternity/options-save-to-file-dialog.webp"
	alt="A dialog over the Options tab with two buttons, Export to mobile and Export to web/steam, and Cancel."
	caption="Holding Share save asks which format to write."
/>

A short tap on **Share save** opens the Android share sheet instead, to send the save to another app.

<Screen
	src="early-eternity/away-progress-popup.webp"
	alt="A popup reading 'While you were away for 21 seconds', listing how antimatter, Infinity Points, Infinities and Replicanti increased, with a Confirm button."
	caption="The away popup after exporting to a file. It only summarizes progress; tap Confirm."
/>

## Which format to pick

| Export              | File name            | Text starts with                        |
| ------------------- | -------------------- | --------------------------------------- |
| Export to web/steam | `ADWebSave_….txt`    | `AntimatterDimensionsSavefileFormat`    |
| Export to mobile    | `ADMobileSave_….txt` | `AntimatterDimensionsAndroidSaveFormat` |

**Pick Export to web/steam** when you export for adg. It is the format of the web and Steam versions, whose published source adg checks your save against. adg also reads mobile exports, but it has to translate their Android-only field names first.

<Callout kind="android">

The two formats hold the same progress. The mobile one is specific to the Android app, while the web/steam one can also be loaded by the web and Steam versions of the game.

</Callout>

## Buttons to leave alone

Exporting and copying never change your progress, so the steps above are safe. These buttons in the same section are not:

- **Import save** replaces your current save with the one you paste.
- **Load backup** and **Select save** switch to another save.
- **Load cloud save** replaces your save with the cloud copy.
- **Reset current save** starts over from nothing.
- **Start Speedrun** restarts the game as a new speedrun save. It asks you to type a confirmation phrase first.

<!-- SpeedrunModeModal.vue startRun → Speedrun.prepareSave → NG.restartWithCarryover in vendor/ad-source/src/core/speedrun.js -->

## Use the export in adg

Open [Save import](/import) and paste the save text, or pick the file. adg reads it on your phone; the save is never uploaded.
